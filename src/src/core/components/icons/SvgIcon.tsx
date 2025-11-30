import React from 'react';
import { getIconPath } from './iconPaths';
import type { IconName } from './iconPaths';

interface IconProps {
  name: IconName;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  isDarkMode?: boolean;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  alt, 
  width = 24, 
  height = 24, 
  className,
  style,
  isDarkMode = false
}) => {
  const iconPath = getIconPath(name, isDarkMode);

  return (
    <img 
      src={iconPath} 
      alt={alt || name} 
      width={width} 
      height={height}
      className={className}
      style={style}
    />
  );
};

export default Icon;
