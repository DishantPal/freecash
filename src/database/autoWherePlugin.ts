// AutoWherePlugin.ts
import { Plugin, OperationNode, OperationNodeTransformer } from "kysely";

interface TableCondition {
  tableName: string;
  conditionField: string;
  conditionValue: any;
}

class AutoWherePlugin implements Plugin {
  conditions: TableCondition[];

  constructor(conditions: TableCondition[]) {
    this.conditions = conditions;
  }

  transformQuery(args: {
    queryId: object;
    node: OperationNode;
  }): OperationNode {
    const transformer = new OperationNodeTransformer();

    return transformer.transform(args.node, (node) => {
      if (node.kind === "SelectQueryNode" && node.from?.kind === "FromNode") {
        this.conditions.forEach((condition) => {
          if (node.from?.table?.name === condition.tableName) {
            // This is a simplification. Adding WHERE conditions properly requires
            // handling existing WHERE clauses and combining conditions logically.
            const whereNode = {
              kind: "WhereNode",
              expressions: [
                {
                  kind: "ReferenceNode",
                  column: condition.conditionField,
                  table: condition.tableName,
                },
                {
                  kind: "ValueNode",
                  value: condition.conditionValue,
                },
              ],
            };

            // Add or modify the where clause of the node
            // This pseudo-code needs actual logic to handle existing where clauses
            node.where = whereNode;
          }
        });
      }

      return node;
    });
  }
}

export { AutoWherePlugin, TableCondition };
