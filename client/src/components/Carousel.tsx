import React, { FC, useState, useRef, useEffect, memo, NamedExoticComponent } from 'react';
import { 
  StyleSheet, Image, FlatList, Text, View, Pressable, 
  NativeScrollEvent, NativeSyntheticEvent, Animated, useColorScheme } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

import { Manga } from '../../types';
import { removeLineBreaks, formatDescription } from "../utils/utils";
import { width } from "../constants/Dimensions";

const CARD_PADDING = 18;
const AUTO_SCROLL_INTERVAL = 8000; // in milliseconds
const PAGINATION_FADE_SPEED = 60;

const Carousel: FC<ICarouselProps> = ({ data }) => {
  const [paginationVisibility] = useState(new Animated.Value(1));
  const [currentPage, setCurrentPage] = useState(1);

  const carouselRef = useRef<FlatList>(null);
  useEffect(() => {
    const autoScroll = () => {
      setCurrentPage(currentPage => {
        const hasNext = currentPage < data.length;
        const target = hasNext ? (currentPage + 1) : 1;
        carouselRef.current?.scrollToOffset({ offset: (target - 1) * width });
        return target;
      });
    }
    const interval = setInterval(autoScroll, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);
  
  const fadeTo = (value: 0 | 1) => {
    Animated.timing(paginationVisibility, { 
      toValue: value, duration: PAGINATION_FADE_SPEED, useNativeDriver: true 
    }).start();
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    fadeTo(0);
    const offset = e.nativeEvent.contentOffset.x;
    if (offset % width === 0) {
      fadeTo(1);
      const actualCurrentPage = offset / width + 1;
      if (currentPage !== actualCurrentPage) {
        setCurrentPage(actualCurrentPage);
      }
    }
  }

  return (
    <View>
      <FlatList data={data} ref={carouselRef}
        horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <CarouselCard manga={item} />}
        onScroll={onScroll} />
      <Animated.View style={[styles.pagination, { opacity: paginationVisibility }]}>
        {/* TODO: Replace with actual pagination visuals */}
        <Text style={{ color: "#fff" }}>{`${currentPage} / ${data.length}`}</Text>
      </Animated.View>
    </View>
  );
}

const CarouselCard: NamedExoticComponent<ICardProps> = memo(({ manga }) => {
  const { colors } = useTheme();
  const mode = useColorScheme();
  const navigation = useNavigation();
  const author = manga.author && removeLineBreaks(manga.author);
  const description = manga.summary && formatDescription(manga.summary);

  return (
    <Pressable onPress={() => navigation.navigate("Overview", { manga })}>
      <View style={styles.card}>
        <Image source={{ uri: manga.imageSrc }} style={StyleSheet.absoluteFill} />
        <BlurView style={styles.content} intensity={85} tint={mode!}>
          <View style={{ width: '62%' }}>
            <Text numberOfLines={1} 
              style={[styles.bold, { color: colors.text, fontSize: 16 }]}>
              {manga.title}
            </Text>
            <Text numberOfLines={1}
              style={[styles.text, { color: colors.text, fontSize: 12, marginTop: 2 }]}>
              {author}
            </Text>
            <Text style={[styles.bold, { color: colors.text, fontSize: 13, marginTop: 20 }]}>
              Synopsis
            </Text>
            <Text numberOfLines={3} 
              style={[styles.text, { color: colors.text, fontSize: 12 }]}>
              {description}
            </Text>
          </View>
          <Image source={{ uri: manga.imageSrc }} 
            style={[styles.image, { borderColor: colors.text }]} />
        </BlurView>
      </View>
    </Pressable>
  );
});

export default Carousel;

const styles = StyleSheet.create({
  pagination: {
    position: "absolute", 
    left: width * 0.05 + CARD_PADDING, // (width * 0.05) is the offset, +18 is the card's padding.
    bottom: CARD_PADDING
  },
  card: {
    flex: 1,
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    overflow: 'hidden',
    borderRadius: 10
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: CARD_PADDING
  },
  image: {
    borderRadius: 10,
    borderWidth: 2,
    width: '32%',
    aspectRatio: 2 / 3
  },
  text: {
    fontFamily: "poppins"
  },
  bold: {
    fontFamily: "poppins-semibold"
  }
});

interface ICarouselProps {
  data: Array<Manga>
}

interface ICardProps {
  manga: Manga
}