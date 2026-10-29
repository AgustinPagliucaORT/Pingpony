import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  titulo: string;
  subtitulo: string;
};

export default function Placeholder({ titulo, subtitulo }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.subtitulo}>{subtitulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.papel,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    color: colors.tinta,
  },
  subtitulo: {
    fontFamily: 'Fredoka_400Regular',
    fontSize: 16,
    color: colors.tinta,
    marginTop: 8,
    textAlign: 'center',
  },
});
