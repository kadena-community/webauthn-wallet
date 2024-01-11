import type { FC } from 'react';
import React from 'react';
export interface ISelectProps extends Omit<React.HTMLAttributes<HTMLSelectElement>, 'aria-label' | 'as' | 'className' | 'children' | 'id'> {
    ariaLabel: string;
    children: React.ReactNode;
    disabled?: boolean;
    startIcon?: React.ReactElement;
    ref?: React.ForwardedRef<HTMLSelectElement>;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    id: string;
    value?: string;
    outlined?: boolean;
}
export declare const Select: FC<ISelectProps>;
//# sourceMappingURL=Select.d.ts.map