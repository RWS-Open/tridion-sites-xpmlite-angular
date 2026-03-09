import { Component, inject, Input, computed } from "@angular/core";

import { XpmPageInfoService } from "../../../../state/headless-xpm-page-info.service";
import { StringUtils } from "../../../../utils/StringUtils";
import { TreeNode } from "../item-selector.model";

@Component({
    selector: "app-organizational-tree-node",
    imports: [OrganizationalTreeNode],
    templateUrl: "./organizational-tree-node.html",
    styleUrl: "./organizational-tree-node.css"
})

export class OrganizationalTreeNode {
    @Input({ required: true }) node: any;
    private xpmPageInfoService = inject(XpmPageInfoService);

    selectedNode = this.xpmPageInfoService.selectedNode;

    totalFolders = computed(() => {
        return this.countNodes(this.xpmPageInfoService.treeData());
    });
    private countNodes(nodes: TreeNode[]): number {
        return nodes.reduce((acc, node) => acc + 1 + (node.children ? this.countNodes(node.children) : 0), 0);
    }

    onSelect() {
        this.xpmPageInfoService.loadAndSelectNode(this.node);

        if (!this.node.expanded) {
            this.node.expanded = true;
        }
    }

    toggleExpand(event: MouseEvent) {
        event.stopPropagation();
        this.node.expanded = !this.node.expanded;

        if (this.node.expanded && !this.node.children?.length) {

            this.xpmPageInfoService.loadAndSelectNode(this.node);
        }
    }

    toggle() {
        this.node.expanded = !this.node.expanded;

        if (this.node.expanded && !this.node.children?.length) {
            const id = StringUtils.sanitizeIdentifier(this.node.id)
            this.xpmPageInfoService.getOrganizationalItems(id).subscribe(items => {
                const mappedChildren = items.map(item => ({
                    $type: item.$type,
                    id: item.Id,
                    label: item.Title,
                    schema: item.LinkedSchema ? item.LinkedSchema.Title : (item.Schema ? item.Schema.Title : ""),
                    schemaId: item.LinkedSchema ? item.LinkedSchema.IdRef : (item.Schema ? item.Schema.IdRef : ""),
                    status: item.IsPublishedInContext,
                    date_modified: item.VersionInfo.RevisionDate,
                    hasChildren: true,
                    children: [],
                    expanded: false,
                    loading: false
                }));
                this.xpmPageInfoService.updateNodeChildren(this.node.id, mappedChildren);
            })
        }
    }
}


