import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole
} from '@floating-ui/react';
import React, { cloneElement, useState } from 'react';
import styles from './overlay.module.css';

type TriggerProps = Record<string, unknown> & { ref?: React.Ref<Element> };

/**
 * Click-to-open panel next to its trigger: flips to stay in view, closes on Escape or an outside click, and
 * returns focus to the trigger. Controlled with `open`/`onOpenChange`, or uncontrolled.
 */
export const Popover: React.FC<{
  content: React.ReactNode;
  children: React.ReactElement<TriggerProps>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** accessible name of the dialog */
  label?: string;
  ref?: React.Ref<Element>;
}> = ({ content, children, open: controlled, onOpenChange, placement = 'top', label, ref, ...forwarded }) => {
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlled ?? uncontrolled;
  const setOpen = (next: boolean) => (onOpenChange ? onOpenChange(next) : setUncontrolled(next));
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: 'dialog' })
  ]);
  const triggerRef = useMergeRefs([refs.setReference, children.props.ref, ref]);
  return (
    <>
      {cloneElement(children, getReferenceProps({ ...forwarded, ...children.props, ref: triggerRef }) as TriggerProps)}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className={styles.popover}
              style={floatingStyles}
              aria-label={label}
              {...getFloatingProps()}
            >
              {content}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};
