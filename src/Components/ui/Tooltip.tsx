import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole
} from '@floating-ui/react';
import React, { cloneElement, useState } from 'react';
import styles from './overlay.module.css';

type TriggerProps = Record<string, unknown> & { ref?: React.Ref<Element> };

/**
 * Short label shown on hover or keyboard focus. Pass `open` to show it on demand (e.g. a validation message).
 * Props it doesn't use are passed on to the trigger, so it can sit inside a Popover's trigger.
 */
export const Tooltip: React.FC<{
  title: React.ReactNode;
  children: React.ReactElement<TriggerProps>;
  open?: boolean;
  placement?: Placement;
  ref?: React.Ref<Element>;
}> = ({ title, children, open: controlled, placement = 'top', ref, ...forwarded }) => {
  const [hovered, setHovered] = useState(false);
  const open = (controlled ?? hovered) && !!title;
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setHovered,
    placement,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { enabled: controlled === undefined, delay: { open: 300 } }),
    useFocus(context, { enabled: controlled === undefined }),
    useDismiss(context),
    useRole(context, { role: 'tooltip' })
  ]);
  const triggerRef = useMergeRefs([refs.setReference, children.props.ref, ref]);
  return (
    <>
      {cloneElement(children, getReferenceProps({ ...forwarded, ...children.props, ref: triggerRef }) as TriggerProps)}
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} className={styles.tooltip} style={floatingStyles} {...getFloatingProps()}>
            {title}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
