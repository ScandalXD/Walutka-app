import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function AppButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  style,
}) {
  const baseStyle = {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderWidth: 1,
  };

  let backgroundColor = '#2563eb';
  let borderColor = '#1d4ed8';
  let textColor = 'white';

  if (variant === 'secondary') {
    backgroundColor = 'white';
    borderColor = '#bfdbfe';
    textColor = '#1d4ed8';
  }

  if (variant === 'danger') {
    backgroundColor = '#ef4444';
    borderColor = '#b91c1c';
    textColor = 'white';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[baseStyle, { backgroundColor, borderColor }, style]}
    >
      <Text
        style={{
          color: textColor,
          fontWeight: '600',
          fontSize: 15,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
