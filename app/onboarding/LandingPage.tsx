import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import SplashScreen from './SplashScreen';

const { width, height } = Dimensions.get('window')

const LandingPage = () => {
    const [showLanding, setShowLanding] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLanding(false);
        }, 2000); 

        return () => clearTimeout(timer);
    }, []); 

    return (
        <View style={{ flex: 1 }}>
            {showLanding ? (
                <View style={{ height: height }}>
                    <Image
                        source={require('@/assets/images/onboarding/landing-top-bg.png')}
                        style={{ 
                            position: 'absolute',
                            zIndex: -1,
                            top: 0,
                            width: 415,
                            height: 360,
                            objectFit: 'contain',
                        }}
                    />
                    <Image
                        source={require('@/assets/images/onboarding/logo.png')}
                        style={{ 
                            margin: 'auto',
                            width: 320,
                            height: 95,
                            objectFit: 'contain',
                        }}
                    />
                    <Image
                        source={require('@/assets/images/onboarding/landing-bottom-bg.png')}
                        style={{ 
                            position: 'absolute',
                            zIndex: -1,
                            bottom: 0,
                            width: 412,
                            height: 370,
                            objectFit: 'contain',
                        }}
                    />
                </View>
            ) : (
                <SplashScreen />
            )}
        </View>
    );
};

export default LandingPage;