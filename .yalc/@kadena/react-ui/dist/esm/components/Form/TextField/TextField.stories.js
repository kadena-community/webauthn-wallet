import { TextField } from '../../Form';
import { statusVariant } from '../../Form/FormFieldWrapper/FormFieldWrapper.css';
import { SystemIcon } from '../../Icon';
import { onLayer2, withContentWidth } from '../../../storyDecorators';
import React from 'react';
const meta = {
    title: 'Form/TextField',
    component: TextField,
    decorators: [withContentWidth, onLayer2],
    parameters: {
        status: { type: 'inDevelopment' },
        docs: {
            description: {
                component: 'TextField is the composition of Input and FormFieldWrapper to provide an input with a label, helper text, and other peripheral information.',
            },
        },
    },
    argTypes: {
        label: {
            description: 'Label for the input',
            control: {
                type: 'text',
            },
        },
        tag: {
            description: 'Tag that is rendered next to the label',
            control: {
                type: 'text',
            },
        },
        info: {
            description: 'Text that is rendered on the top right with an info icon',
            control: {
                type: 'text',
            },
        },
        helperText: {
            description: 'Text that is rendered below the input to give the user additional information. Often will be used for validation messages.',
            control: {
                type: 'text',
            },
        },
        leadingText: {
            description: "Leading text that is rendered inside the input's border.",
            control: {
                type: 'text',
            },
        },
        startIcon: {
            description: 'Initial icon that can be passed as a prop.',
        },
        status: {
            options: [
                undefined,
                ...Object.keys(statusVariant),
            ],
            description: 'This determines the color of the helper text and input border. It can be used to indicate an error.',
            control: {
                type: 'select',
            },
        },
        disabled: {
            description: 'Disables the input and applies visual styling.',
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
export const Group = {
    name: 'Text Field',
    args: {
        tag: 'tag',
        helperText: 'This is helper text',
        info: '(optional)',
        label: 'Label',
        disabled: false,
        status: undefined,
        startIcon: React.createElement(SystemIcon.Account, null),
        leadingText: 'Leading',
    },
    render: ({ leadingText, startIcon, disabled, status, tag, helperText, info, label, }) => {
        return (React.createElement(TextField, { tag: tag, info: info, label: label, status: status, disabled: disabled, helperText: helperText, id: "inputStory", leadingText: leadingText, startIcon: startIcon, placeholder: "This is a placeholder" }));
    },
};
export default meta;
//# sourceMappingURL=TextField.stories.js.map