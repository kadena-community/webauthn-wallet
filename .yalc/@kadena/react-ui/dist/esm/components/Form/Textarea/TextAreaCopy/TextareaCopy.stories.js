import React from 'react';
import { onLayer2, withContentWidth } from '../../../../storyDecorators';
import { TextareaCopy } from './TextareaCopy';
const meta = {
    title: 'Form/Textarea/TextareaCopy',
    component: TextareaCopy,
    decorators: [withContentWidth, onLayer2],
    parameters: {
        docs: {
            description: {
                component: 'The TextAreaCopy is a composition of the native textArea element and a copy button.',
            },
        },
    },
    argTypes: {
        disabled: {
            description: 'Disables the textArea and applies visual styling.',
            control: {
                type: 'boolean',
            },
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
    },
};
export default meta;
export const TextareaCopyStory = {
    name: 'TextareaCopy',
    args: {
        disabled: false,
        fontFamily: 'codeFont',
        outlined: false,
    },
    render: (props) => {
        return (React.createElement(TextareaCopy, { ...props, id: "TextareaCopyStory", placeholder: "This is a placeholder" }));
    },
};
//# sourceMappingURL=TextareaCopy.stories.js.map