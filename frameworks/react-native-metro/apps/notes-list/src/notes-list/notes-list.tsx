import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Note {
  id: string;
  content: string;
  createdAt: number;
}

interface NoteItemProps {
  note: Note;
  onPress: (note: Note) => void;
}

// Function to extract text from the first HTML tag
function extractTitleFromHtml(htmlContent: string): string {
  // Find the first HTML tag and extract its text content
  const match = htmlContent.match(/<[^>]*>([^<]*)<\/[^>]*>/);
  if (match?.[1]) {
    const firstTagText = match[1].trim();
    return firstTagText.length > 50
      ? firstTagText.substring(0, 50) + '...'
      : firstTagText;
  }
  // Fallback: if no HTML tags found, return the content as is
  return htmlContent.length > 50
    ? htmlContent.substring(0, 50) + '...'
    : htmlContent;
}

function NoteItem({ note, onPress }: NoteItemProps) {
  const title = extractTitleFromHtml(note.content);

  return (
    <TouchableOpacity style={styles.noteItem} onPress={() => onPress(note)}>
      <Text style={styles.noteTitle} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
      <Text style={styles.noteDate}>
        {new Date(note.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
}

interface NotesListProps {
  notes: Note[];
  onNotePress: (note: Note) => void;
}

export default function NotesList({ notes, onNotePress }: NotesListProps) {
  const handleNotePress = (note: Note) => {
    onNotePress(note);
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteItem note={item} onPress={handleNotePress} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        style={styles.notesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notesListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#333',
  },
  notesList: {
    flex: 1,
  },
  notesListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  noteItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
