import { useCallback, useEffect, useMemo, useState } from "react";
import { backendClient } from "@/api";

export interface BuilderSystemStatus {
  label: "Ollama" | "Qdrant" | "Temporal";
  value: "Online" | "Offline";
  detail: string;
  tone: "emerald" | "rose";
}

interface BuilderRuntimeState {
  stackOptions: string[];
  templateOptions: string[];
  modelOptions: string[];
  providerInfo: string;
  capabilityInfo: string;
  systemStatus: BuilderSystemStatus[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const collectStringArrays = (value: unknown, targetKeys: string[]): string[] => {
  const output = new Set<string>();

  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const item of node) {
        if (typeof item === "string") {
          output.add(item);
        } else {
          walk(item);
        }
      }
      return;
    }

    if (!isRecord(node)) return;

    for (const [key, entry] of Object.entries(node)) {
      if (targetKeys.includes(key) && Array.isArray(entry)) {
        entry.forEach((item) => {
          if (typeof item === "string") output.add(item);
        });
      }
      walk(entry);
    }
  };

  walk(value);
  return [...output];
};

const collectModelOptions = (value: unknown): string[] => {
  const options = new Set<string>();

  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const item of node) {
        if (typeof item === "string") {
          options.add(item);
        } else if (isRecord(item)) {
          const candidate = item.name ?? item.model ?? item.id;
          if (typeof candidate === "string") options.add(candidate);
          walk(item);
        }
      }
      return;
    }

    if (!isRecord(node)) return;

    const candidate = node.model ?? node.selected_model ?? node.current_model;
    if (typeof candidate === "string") options.add(candidate);

    Object.entries(node).forEach(([key, entry]) => {
      if (["models", "available_models", "local_models"].includes(key)) {
        walk(entry);
      }
    });
  };

  walk(value);
  return [...options];
};

const statusFromResult = (
  label: BuilderSystemStatus["label"],
  result: PromiseSettledResult<Record<string, unknown>>,
): BuilderSystemStatus => {
  if (result.status === "rejected") {
    return {
      label,
      value: "Offline",
      detail: result.reason instanceof Error ? result.reason.message : "request failed",
      tone: "rose",
    };
  }

  const payload = result.value;
  const online =
    payload.ok === true ||
    payload.status === "ok" ||
    payload.status === "online" ||
    payload.healthy === true;

  const detail = JSON.stringify(payload).slice(0, 120) || "n/a";

  return {
    label,
    value: online ? "Online" : "Offline",
    detail,
    tone: online ? "emerald" : "rose",
  };
};

const initialState: BuilderRuntimeState = {
  stackOptions: [],
  templateOptions: [],
  modelOptions: [],
  providerInfo: "Provider info non disponibile",
  capabilityInfo: "Nessuna capability caricata",
  systemStatus: [
    { label: "Ollama", value: "Offline", detail: "not loaded", tone: "rose" },
    { label: "Qdrant", value: "Offline", detail: "not loaded", tone: "rose" },
    { label: "Temporal", value: "Offline", detail: "not loaded", tone: "rose" },
  ],
};

export const useBuilderRuntime = () => {
  const [state, setState] = useState<BuilderRuntimeState>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const [ollama, qdrant, temporal, actions, workflow] = await Promise.allSettled([
      backendClient.call("ollama_status_v1_system_ollama_status_get"),
      backendClient.call("qdrant_status_v1_system_qdrant_status_get"),
      backendClient.call("temporal_status_v1_system_temporal_status_get"),
      backendClient.call("ide_actions_v1_ide_actions_get"),
      backendClient.call("workflow_golden_path_v1_system_workflow_golden_path_get"),
    ]);

    const modelOptions = ollama.status === "fulfilled" ? collectModelOptions(ollama.value) : [];

    const stackOptions = [
      ...(actions.status === "fulfilled" ? collectStringArrays(actions.value, ["stacks", "stack", "languages"]) : []),
      ...(workflow.status === "fulfilled" ? collectStringArrays(workflow.value, ["stacks", "stack", "languages"]) : []),
    ];

    const templateOptions = [
      ...(actions.status === "fulfilled" ? collectStringArrays(actions.value, ["templates", "template", "blueprints", "starters"]) : []),
      ...(workflow.status === "fulfilled" ? collectStringArrays(workflow.value, ["templates", "template", "blueprints", "starters"]) : []),
    ];

    const uniqueStack = [...new Set(stackOptions)];
    const uniqueTemplate = [...new Set(templateOptions)];

    setState({
      stackOptions: uniqueStack,
      templateOptions: uniqueTemplate,
      modelOptions,
      providerInfo:
        ollama.status === "fulfilled"
          ? `Ollama status source: ${Object.keys(ollama.value).slice(0, 6).join(", ") || "empty"}`
          : "Provider unavailable",
      capabilityInfo:
        actions.status === "fulfilled"
          ? (() => {
              const payload = actions.value as Record<string, unknown>;
              const actionsList = payload.actions;
              return `${Array.isArray(actionsList) ? actionsList.length : 0} capabilities da /v1/ide/actions`;
            })()
          : "Capabilities unavailable",
      systemStatus: [
        statusFromResult("Ollama", ollama as PromiseSettledResult<Record<string, unknown>>),
        statusFromResult("Qdrant", qdrant as PromiseSettledResult<Record<string, unknown>>),
        statusFromResult("Temporal", temporal as PromiseSettledResult<Record<string, unknown>>),
      ],
    });

    if (ollama.status === "rejected" && qdrant.status === "rejected" && temporal.status === "rejected") {
      setError("Impossibile leggere lo stato sistema dal backend Copilot.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applyModel = useCallback(async (model: string) => {
    if (!model) return;
    try {
      setError(null);
      await backendClient.call("ollama_select_model_v1_system_ollama_select_model_post", {
        body: { model },
      });
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore cambio modello";
      setError(`Cambio modello fallito: ${message}`);
    }
  }, [refresh]);

  return useMemo(
    () => ({
      ...state,
      isLoading,
      error,
      refresh,
      applyModel,
    }),
    [state, isLoading, error, refresh, applyModel],
  );
};
