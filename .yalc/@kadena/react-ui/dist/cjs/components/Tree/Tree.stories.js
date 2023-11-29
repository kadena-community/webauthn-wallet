"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamic = void 0;
const react_1 = __importDefault(require("react"));
const _1 = require("./");
const meta = {
    title: 'Components/Tree',
    parameters: {
        status: {
            type: ['needsRevision'],
        },
        docs: {
            description: {
                component: '<strong>Deprecated. Do not use.</strong><br />Will be refactored as it does not meet our standards.<br /><br /><em>The Tree component renders a tree structure with a root node and child nodes. The tree can be expanded and collapsed by clicking on the root node. The tree can be set to open by default with the `isOpen` prop. The tree can be set to close its siblings when opened with the `linked` prop.</em>',
            },
        },
    },
    argTypes: {
        isOpen: {
            description: 'Initial value for list',
            defaultValue: false,
            control: {
                type: 'boolean',
            },
        },
        linked: {
            description: 'by enabling linked feature sibling trees will close their siblings on open',
            defaultValue: false,
            control: {
                type: 'boolean',
            },
        },
        title: {
            description: 'root title of the tree',
            defaultValue: '',
            control: {
                type: 'text',
            },
        },
        items: {
            description: 'JSON object of items',
            defaultValue: {},
            control: {
                type: 'array',
            },
        },
    },
};
exports.default = meta;
exports.Dynamic = {
    name: 'Tree',
    args: {
        title: 'Parent',
        isOpen: true,
        linked: false,
        items: [
            {
                title: 'Child 1',
                items: [{ title: 'Sub Child 1' }, { title: 'Sub Child 2' }],
                isOpen: true,
                onOpen: () => console.log('open child 1'),
                onClose: () => console.log('close child 1'),
            },
            {
                title: 'Child 2',
                items: [{ title: 'Sub Child 1' }, { title: 'Sub Child 2' }],
                isOpen: true,
                onOpen: () => console.log('open child 2'),
                onClose: () => console.log('close child 2'),
            },
            {
                title: 'Child 3',
                items: [{ title: 'Sub Child 1' }, { title: 'Sub Child 2' }],
                isOpen: true,
                onOpen: () => console.log('open child 3'),
                onClose: () => console.log('close child 3'),
            },
        ],
    },
    render: ({ title, isOpen, items, linked }) => {
        return (react_1.default.createElement(_1.Tree, { title: title, isOpen: Boolean(isOpen), items: items !== null && items !== void 0 ? items : [], linked: Boolean(linked) }));
    },
};
//# sourceMappingURL=Tree.stories.js.map