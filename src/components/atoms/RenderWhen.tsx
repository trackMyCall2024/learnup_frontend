import React from 'react';

interface RenderWhenProps {
    when?: boolean; // Condition
    if?: boolean; // Condition
    isTrue?: boolean; // Condition
    children: React.ReactNode; // Display if condition is valid
    elseRender?: React.ReactNode; // Display if condition is invalid
}

const RenderWhen: React.FC<RenderWhenProps> = ({
    when,
    if: ifCond,
    isTrue,
    children,
    elseRender = null,
}) => {
    const condition = when ?? ifCond ?? isTrue ?? false;

    return condition ? <>{children}</> : <>{elseRender}</>;
};

export default RenderWhen;
