import { describe, expect, it } from "vitest";
import { resolveTableActionPreset } from "./TableUi";

describe("TableUi presets", () => {
  it("keeps runtime and preview on the same module tone", () => {
    const runtimePreset = resolveTableActionPreset("runtime");
    const previewPreset = resolveTableActionPreset("preview");

    expect(runtimePreset.tone).toBe("module");
    expect(previewPreset.tone).toBe("module");
    expect(runtimePreset.tone).toBe(previewPreset.tone);
  });

  it("keeps clone visually distinct from system edit/delete actions", () => {
    const clonePreset = resolveTableActionPreset("clone");
    const editPreset = resolveTableActionPreset("edit");
    const deletePreset = resolveTableActionPreset("delete");

    expect(clonePreset.tone).toBe("neutral");
    expect(editPreset.tone).toBe("info");
    expect(deletePreset.tone).toBe("danger");
    expect(clonePreset.tone).not.toBe(editPreset.tone);
    expect(clonePreset.tone).not.toBe(deletePreset.tone);
  });
});
