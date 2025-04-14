import { Badge } from 'antd';
import { ReactNode } from 'react';

interface CustomBadgeProps {
  count: number;
  children: ReactNode;
  offset?: [number, number];
}

const CustomBadge = ({ count, children, offset = [1, -1] }: CustomBadgeProps) => {
  return (
    <Badge 
      count={count}
      showZero
      style={{
        backgroundColor: '#ff3b30',
        borderRadius: '50%',
        width: '16px',
        height: '16px',
        minWidth: '16px',
        minHeight: '16px',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
      offset={offset}
    >
      {children}
    </Badge>
  );
};

export default CustomBadge; 