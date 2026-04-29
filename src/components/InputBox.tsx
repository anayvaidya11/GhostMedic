import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

type Props = {
  onSubmit: (text: string) => void;
  placeholder?: string;
};

export function InputBox({ onSubmit, placeholder }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <View className="border border-ops-line bg-ops-panel rounded-sm">
      <View className="flex-row items-center px-3 py-2 border-b border-ops-line bg-ops-char">
        <Text className="text-signal-green text-xs tracking-[3px] uppercase">
          {'>'} Medic Input
        </Text>
        <View className="ml-2 w-1.5 h-1.5 bg-signal-green" />
      </View>
      <View className="flex-row items-end p-3">
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder ?? 'Describe what you observe…'}
          placeholderTextColor="#5b6b48"
          multiline
          onSubmitEditing={submit}
          blurOnSubmit
          returnKeyType="send"
          className="flex-1 text-ops-sage text-base min-h-[56px] max-h-[140px] px-2 py-2 bg-ops-black border border-ops-line rounded-sm"
          style={{ textAlignVertical: 'top' }}
        />
        <Pressable
          onPress={submit}
          className="ml-3 px-4 py-3 bg-ops-olive border border-ops-drab active:bg-ops-drab"
        >
          <Text className="text-ops-sage text-xs tracking-[3px] uppercase font-bold">
            Transmit
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
