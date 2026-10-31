import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors } from '../../styles/theme';
import { getImageSource, defaultHeroImage, defaultRestoImage } from '../../utils/assetImages';
import Footer from '../../components/Footer';

const { width } = Dimensions.get('window');

const categories = [
  {
    name: 'Makanan Utama',
    description: 'Hidangan hangat untuk mengisi hari.',
    image: '/nasi-goreng-kampung.jpg',
  },
  {
    name: 'Camilan',
    description: 'Teman kecil untuk setiap cerita.',
    image: '/pisang-goreng.jpg',
  },
  {
    name: 'Dessert',
    description: 'Manisnya momen setelah makan.',
    image: '/klepon.jpg',
  },
  {
    name: 'Minuman',
    description: 'Kesegaran untuk menemani suasana.',
    image: '/es-teh-manis.jpg',
  },
];

export default function HomeScreen({ onNavigate }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO SECTION */}
      <View style={styles.heroSection}>
        <Text style={styles.eyebrow}>RESTORAN · INDONESIAN COMFORT FOOD</Text>

        <Text style={styles.heroTitle}>
          Satu meja,{'\n'}
          <Text style={styles.heroTitleItalic}>banyak cerita.</Text>
        </Text>

        <Text style={styles.heroDescription}>
          Hidangan khas Indonesia dengan cita rasa autentik, disajikan dalam
          suasana hangat untuk momen yang lebih bermakna.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onNavigate('Menu')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Lihat Menu →</Text>
        </TouchableOpacity>

        <Text style={styles.heroCaption}>HIDANGAN HANGAT. MOMEN YANG BERARTI.</Text>

        <View style={styles.heroImageWrap}>
          <Image
            source={defaultHeroImage}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* DARI DAPUR KAMI (MENU PREVIEW) */}
      <View style={styles.section}>
        <Text style={styles.eyebrow}>02 / DARI DAPUR KAMI</Text>
        <Text style={styles.sectionTitle}>
          Temukan rasa <Text style={styles.heroTitleItalic}>favoritmu.</Text>
        </Text>
        <Text style={styles.sectionSubtitle}>
          Pilih kategori untuk menemukan hidangan yang ingin kamu nikmati.
        </Text>

        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={styles.categoryCard}
              onPress={() => onNavigate('Menu', { category: category.name })}
              activeOpacity={0.85}
            >
              <Image
                source={getImageSource(category.image)}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryBody}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
                <Text style={styles.categoryLink}>Lihat Menu →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* TENTANG KAMI */}
      <View style={styles.aboutSection}>
        <Text style={styles.eyebrow}>TENTANG KAMI</Text>
        <Text style={styles.sectionTitle}>
          Bukan sekadar tempat{'\n'}
          <Text style={styles.heroTitleItalic}>untuk makan.</Text>
        </Text>
        <Text style={styles.aboutText}>
          Ruang Rasa adalah tempat menikmati hidangan khas Indonesia dalam
          suasana sederhana, hangat, dan nyaman.
        </Text>

        <View style={styles.aboutImageWrap}>
          <Image
            source={defaultRestoImage}
            style={styles.aboutImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: colors.eyebrow,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.dark,
    lineHeight: 42,
    marginBottom: 14,
  },
  heroTitleItalic: {
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: colors.oliveDark,
  },
  heroDescription: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.olive,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.pureWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  heroCaption: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.muted,
    fontWeight: '600',
    marginBottom: 20,
  },
  heroImageWrap: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.line,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 24,
  },
  categoryGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.line,
  },
  categoryBody: {
    padding: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 12,
  },
  categoryLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.olive,
  },
  aboutSection: {
    paddingHorizontal: 20,
    paddingTop: 36,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  aboutText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutImageWrap: {
    width: '100%',
    height: 210,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.line,
  },
  aboutImage: {
    width: '100%',
    height: '100%',
  },
});

