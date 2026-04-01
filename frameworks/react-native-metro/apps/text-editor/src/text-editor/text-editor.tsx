import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';

export type TextEditorProps = {
  richtext: React.RefObject<RichEditor>;
};

export default function TextEditor({ richtext }: TextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleHead = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor }}>H1</Text>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        disabled={isFocused}
        onPress={() => {
          richtext.current?.focusContentEditor();
          setIsFocused(true);
        }}
      >
        <ScrollView style={{ flex: 1, borderRadius: 10 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View style={styles.editorContainer}>
              <RichEditor
                ref={richtext}
                onBlur={() => {
                  setIsFocused(false);
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </TouchableOpacity>
      <RichToolbar
        style={{ borderRadius: 10 }}
        editor={richtext}
        actions={[
          actions.heading1,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.code,
          actions.undo,
          actions.redo,
        ]}
        iconMap={{ [actions.heading1]: handleHead }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
  },
  editorContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
});
