import React, { useEffect, useState } from 'react'
import { View, Image, ImageSourcePropType, Text, StyleSheet, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent, BackHandler, Pressable, Animated } from 'react-native'
import { Dimensions, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

export type onboardingItem = {
    id: number,
    image: ImageSourcePropType,
    title: string,
    subtitle: string,
}

const { width, height } = Dimensions.get('window')

const item = [
    {
        id: 1,
        image: require('@/assets/images/onboarding/algoritma-c45.png'),
        title: 'Prediksi diabetes',
        subtitle: 'Aplikasi yang menggunakan algoritma C4.5 yang membantu Anda mengetahui apakah Anda menderita diabetes atau tidak',
    },
    {
        id: 2,
        image: require('@/assets/images/onboarding/notes.png'),
        title: 'Pencatatan harian',
        subtitle: 'Aplikasi yang membantu melacak kesehatan tubuh Anda untuk mengurangi dampak parah diabetes',
    },
    {
        id: 3,
        image: require('@/assets/images/onboarding/timer.png'),
        title: 'Pengingat jadwal',
        subtitle: 'Aplikasi yang mengatur pengingat untuk mengurangi dampak/risiko diabetes yang parah',
    },
]

export default function SplashScreen() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const ref = React.useRef<FlatList>(null); 

    useEffect(() => {
        const backAction = () => {
            if (currentSlideIndex === 0 || currentSlideIndex === 3) {
                // Prevent back navigation on first and last slides
                return true
            } else {
                // Allow going to previous slide for middle slides
                goPrevSlide()
                return true
            }
        }
    
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        )
    
        return () => backHandler.remove() // Cleanup the event listener
    }, [currentSlideIndex])

    const RenderItem = ({ item }: { item: onboardingItem }) => {
        return (
            <View style={ styles.onboardingContainer }>
                <Text style={styles.title}>{item.title}</Text>
                {item.id == 1 && (
                    <View>
                        <Text style={styles.subtitle}>{item.subtitle.substring(0, 40)}</Text>
                        <Text style={styles.subtitle}>{ item.subtitle.substring(41, 77) }</Text>
                        <Text style={styles.subtitle}>{ item.subtitle.substring(78, 112) }</Text>
                    </View>
                )}
        
                {item.id == 2 && (
                    <View>
                        <Text style={styles.subtitle}>{item.subtitle.substring(0, 40)}</Text>
                        <Text style={styles.subtitle}>{ item.subtitle.substring(41, 75) }</Text>
                        <Text style={styles.subtitle}>{ item.subtitle.substring(76, 90) }</Text>
                    </View>
                )}
        
                {item.id == 3 && (
                    <View>
                        <Text style={styles.subtitle}>{item.subtitle.substring(0, 38)}</Text>
                        <Text style={styles.subtitle}>{ item.subtitle.substring(39, 77) }</Text>
                        <Text style={styles.subtitle}>{ item.subtitle.substring(78, 83) }</Text>
                    </View>
                )}
                
                <Image
                    source={item.image}
                    style={ styles.img }
                />
            </View>
        )
    }

    const Footer = () => {
        return (
            <View
                style={{
                    marginTop: '18%',
                    marginHorizontal: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Prev Button */}
                <TouchableOpacity
                    style={[
                        styles.stepBtn,
                        {
                            backgroundColor: 'transparent',
                            borderColor: '#DA6E35',
                            borderWidth: 1,
                            opacity: currentSlideIndex == 0? 0 : 1
                        }
                    ]}
                    onPress={goPrevSlide}
                    disabled={currentSlideIndex == 0? true : false}
                >
                    <Ionicons name='arrow-back-outline' size={26} color='#DA6E35' />
                </TouchableOpacity>

                {/* Step Indicator */}
                <View
                    style={{ 
                        marginHorizontal: 'auto',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    {item.slice(0, 3).map((_, index) => {
                        // Create an animated value for each indicator
                        const widthAnim = React.useRef(new Animated.Value(20)).current;

                        // Animate the width when the current slide changes
                        React.useEffect(() => {
                            Animated.timing(widthAnim, {
                                toValue: currentSlideIndex === index ? 45 : 20,
                                duration: 100, // Adjust duration as needed
                                useNativeDriver: false // width animation requires non-native driver
                            }).start();
                        }, [currentSlideIndex]);

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.indicator,
                                    { 
                                        width: widthAnim,
                                        backgroundColor: currentSlideIndex === index ? '#DA6E35' : '#969696'
                                    }
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={goNextSlide}
                >
                    <Ionicons name='arrow-forward-outline' size={26} color='white' />
                </TouchableOpacity>
            </View>
        );
    }

    const updateCurrentSlideIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width + 1);
        // console.log(contentOffsetX)
        // console.log(currentIndex)
    };

    const goNextSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex <= item.length - 1) { 
            const offset = nextSlideIndex * width;
            ref?.current?.scrollToOffset({ offset, animated: true });
            setCurrentSlideIndex(nextSlideIndex);
        } else {
            router.replace('/(auth)/login')
        }
    };
      
    const goPrevSlide = () => {
        const prevSlideIndex = currentSlideIndex - 1;
        if (prevSlideIndex >= 0) { 
            const offset = prevSlideIndex * width;
            ref?.current?.scrollToOffset({ offset, animated: true });
            setCurrentSlideIndex(prevSlideIndex);
        }
    };

    const skip = () => {
        const nextSlideIndex = item.length - 1;
        const offset = nextSlideIndex * width;
        ref?.current?.scrollToOffset({ offset, animated: true });
        setCurrentSlideIndex(nextSlideIndex);
    };

    return (
        <View style={{ height: height }}>
            <TouchableOpacity
                style={{
                    marginTop: '7%',
                    marginLeft: 15,
                    opacity: currentSlideIndex == 2 ? 0 : 1,
                }}
                onPress={skip}
                disabled={currentSlideIndex == 2 ? true : false}
            >
                <Text
                    style={{
                        color: '#DA6E35',
                        fontSize: 16,
                        fontFamily: 'Helvetica-Bold',
                    }}
                >
                    Lewati
                </Text>
            </TouchableOpacity>
            <View style={{ marginTop: '23%', marginLeft: 15}}>
                <FlatList
                    onMomentumScrollEnd={updateCurrentSlideIndex}
                    ref={ref}
                    data={item}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    contentContainerStyle={{ height: height * 0.62 }}
                    horizontal
                    scrollEnabled={false} 
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            
            <Footer />
            
            <Image
                source={require('@/assets/images/onboarding/splash-screen-bg.png')}
                style={{ 
                    position: 'absolute',
                    zIndex: -1,
                    bottom: 0,
                    width: 412,
                    height: 474,
                    objectFit: 'contain',
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    onboardingContainer: {
        width: width,
    },
    title: {
        color: '#DA6E35',
        fontSize: 32,
        fontFamily: 'Helvetica-Bold',
    },
    subtitle: {
        marginBottom: -6,
        color: '#969696',
        fontSize: 16,
        fontFamily: 'Helvetica',
    },
    img: {
        marginLeft: 'auto',
        width: 320,
        height: 380,
        objectFit: 'contain',
    },
    indicator: {
        marginHorizontal: 2,
        width: 20,
        height: 20,
        backgroundColor: '#969696',
        borderRadius: 20,
    },
    stepBtn: {
        width: 65,
        height: 48,
        backgroundColor: '#DA6E35',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});