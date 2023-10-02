import { forwardRef } from 'react';

interface DraggableItemProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: {
    transform: string | undefined;
    transition: string | undefined;
  }
}

export const DraggableItem = forwardRef<HTMLDivElement, DraggableItemProps>(({ children, className, style, ...props }, ref) => {
  return (
    <div {...props} ref={ref} style={style} className={className}>{children}</div>
  );
});
