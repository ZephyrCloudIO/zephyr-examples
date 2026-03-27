/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Suspense, useRef, useState } from 'react';

import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

import type { RichEditor } from 'react-native-pell-rich-editor';
// import {Note, useNotes} from '@database';
import AddIcon from './components/AddIcon';
import { useNotes } from './database/useNotes.ts';

const actions = [
  {
    name: 'add',
    text: 'Add',
    icon: <AddIcon />,
  },
];

// @ts-ignore
const TextEditor = React.lazy(() => import('MFTextEditor/text-editor'));
// @ts-ignore
const NotesList = React.lazy(() => import('MFNotesList/notes-list'));

// Card component with medium border radius, 16px padding, and shadows
const Card = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.card}>{children}</View>;
};

const _BORDER_WIDTH = 8;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const { createNote, notes, updateNote } = useNotes();

  const backgroundStyle = {
    backgroundColor: '#F3F3F3',
  };
  const richtext = useRef<RichEditor | null>(null);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  const handleAddNote = async () => {
    const content = await richtext.current?.getContentHtml();
    if (selectedNote) {
      await updateNote(selectedNote.id, content || '');
    } else if (content && content.length > 0) {
      await createNote(content);
    }
    richtext.current?.setContentHTML('');
    richtext.current?.dismissKeyboard();
  };

  const handleNotePress = (note: any) => {
    setSelectedNote(note);
    richtext.current?.setContentHTML(note.content);
  };

  return (
    <View
      style={[
        backgroundStyle,
        {
          width: screenWidth,
          height: screenHeight,
          paddingTop:
            Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 20,
          paddingLeft: 0,
          paddingBottom: 0,
          paddingRight: 0,
        },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
          gap: 16,
        }}
      >
        <Card>
          <Suspense
            fallback={
              <View style={styles.card}>
                <Text>Loading...</Text>
              </View>
            }
          >
            <TextEditor richtext={richtext} />
          </Suspense>
        </Card>
        <Card>
          <Suspense
            fallback={
              <View style={styles.card}>
                <Text>Loading...</Text>
              </View>
            }
          >
            <NotesList notes={notes} onNotePress={handleNotePress} />
          </Suspense>
        </Card>
      </View>
      <FloatingAction
        position="right"
        listenKeyboard
        overrideWithAction
        actions={actions}
        onPressItem={handleAddNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12, // Medium border radius
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
    width: '100%', // Stretch to max width
    height: '50%', // 50% of screen height
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
