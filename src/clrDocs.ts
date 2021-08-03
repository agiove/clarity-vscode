import { clrAlertMeta } from "./metadata/alert.metadata";
import { clrButtonGroupMeta } from "./metadata/button-group.metadata";
import { clrCheckboxMeta } from "./metadata/checkbox.metadata";
import { clrDatagridMeta } from "./metadata/datagrid.metadata";
import { clrDropdownMeta } from "./metadata/dropdown.metadata";
import { clrModalMeta } from "./metadata/modal.metadata";
import { clrStackViewMeta } from "./metadata/stack-view.metadata";
import { clrTabsMeta } from "./metadata/tabs.metadata";
import { clrTooltipMeta } from "./metadata/tooltip.metadata";
import { clrTreeNodeMeta } from "./metadata/tree-node.metadata";
import { clrWizardMeta } from "./metadata/wizard.metadata";

import { DefinitionInfo } from "./shared/DefinitionInfo";

const baseUrl = "https://vmware.github.io/clarity/documentation/";

const clrAlertInfo =
  "An alert is a banner that uses text, color, and an icon to denote the severity of a message.";
const clrButtonGroupInfo =
  "Button groups are for creating collections of similar type action buttons.";
const clrCheckboxInfo =
  "With checkboxes, users can select multiple options in a list of options.";
const clrDatagridInfo =
  "Datagrids are for organizing large volumes of data that users can scan, compare, and perform actions on.";
const clrDropdownInfo =
  "A dropdown menu lists actions that users can perform within an application or on a selected object.";
const clrModalInfo =
  "Modals provide information or help a user complete a task. They require the user to take an action to dismiss them.";
const clrStackViewInfo =
  "A stack view displays key/value pairs, which users can expand to show more detail.";
const clrTabsInfo =
  "Tabs divide content into separate views which users navigate between.";
const clrTreeNodeInfo =
  "A tree is a hierarchical component that shows the visual representation of the parent-child relationship between nodes.";
const clrTooltipInfo =
  "A tooltip provides a short description of a UI element.";
const clrWizardInfo =
  "A wizard presents a multi-step workflow that users perform in a recommended sequence.";

let docMap: Map<string, DefinitionInfo> = new Map();

docMap.set(
  "clr-alert",
  new DefinitionInfo(
    "<clr-alert>",
    clrAlertInfo,
    baseUrl + "alerts",
    clrAlertMeta
  )
);
docMap.set(
  "clr-button-group",
  new DefinitionInfo(
    "<clr-button-group>",
    clrButtonGroupInfo,
    baseUrl + "button-group",
    clrButtonGroupMeta
  )
);
docMap.set(
  "clr-checkbox",
  new DefinitionInfo(
    "<clr-checkbox>",
    clrCheckboxInfo,
    baseUrl + "checkboxes",
    clrCheckboxMeta
  )
);
docMap.set(
  "clr-datagrid",
  new DefinitionInfo(
    "<clr-datagrid>",
    clrDatagridInfo,
    baseUrl + "datagrid",
    clrDatagridMeta
  )
);
docMap.set(
  "clr-dropdown",
  new DefinitionInfo(
    "<clr-dropdown>",
    clrDropdownInfo,
    baseUrl + "dropdowns",
    clrDropdownMeta
  )
);
docMap.set(
  "clr-modal",
  new DefinitionInfo(
    "<clr-modal>",
    clrModalInfo,
    baseUrl + "modals",
    clrModalMeta
  )
);
docMap.set(
  "clr-stack-view",
  new DefinitionInfo(
    "<clr-stack-view>",
    clrStackViewInfo,
    baseUrl + "stack-view",
    clrStackViewMeta
  )
);
docMap.set(
  "clr-tabs",
  new DefinitionInfo("<clr-tabs>", clrTabsInfo, baseUrl + "tabs", clrTabsMeta)
);
docMap.set(
  "clr-tree-node",
  new DefinitionInfo(
    "<clr-tree-node>",
    clrTreeNodeInfo,
    baseUrl + "tree-view",
    clrTreeNodeMeta
  )
);
docMap.set(
  "clr-tooltip",
  new DefinitionInfo(
    "<clr-tooltip>",
    clrTooltipInfo,
    baseUrl + "tooltips",
    clrTooltipMeta
  )
);
docMap.set(
  "clr-wizard",
  new DefinitionInfo(
    "<clr-wizard>",
    clrWizardInfo,
    baseUrl + "wizards",
    clrWizardMeta
  )
);

export class ClrDocsUtil {
  hasDoc(tag: string): boolean {
    return docMap.has(tag);
  }

  getDoc(tag: string): DefinitionInfo {
    let definition: DefinitionInfo = docMap.get(tag);

    if (!definition.lazy) return definition;

    definition.lazy = false;

    let meta = definition.meta.members;

    Object.keys(meta).map((propertyName) => {
      let member = meta[propertyName];
      if (
        member instanceof Array &&
        member[0].hasOwnProperty("decorators") &&
        member[0].decorators instanceof Array &&
        member[0].decorators[0].hasOwnProperty("arguments") &&
        member[0].decorators[0].arguments instanceof Array &&
        member[0].decorators[0].hasOwnProperty("expression")
      ) {
        let attributeName = member[0].decorators[0].arguments[0];
        let exprName = member[0].decorators[0].expression.name;
        if (exprName == "Input") definition.inputs.push(attributeName);
        else if (exprName == "Output") definition.outputs.push(attributeName);
      }
    });

    return definition;
  }
}
