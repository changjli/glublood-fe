import { View, Text, Image, ImageSourcePropType } from 'react-native'
import React, { useEffect, useState } from 'react'

interface CustomImageProps {
    imgUrl: string
    height?: number
    width?: number
}

export default function CustomImage({ imgUrl, height = 0, width = 0 }: CustomImageProps) {

    const [ratio, setRatio] = useState({ width: height, height: width })

    useEffect(() => {
        // Get image dimensions
        Image.getSize(
            imgUrl,
            (w, h) => {
                if (width != 0) {
                    setRatio({ width: width, height: (w / h) * height })
                } else if (height != 0) {
                    setRatio({ width: (height / width) * width, height: height })
                }
            },
            (error) => {
                console.error('Error fetching image dimensions:', error);
            }
        );
    }, [imgUrl]);

    return (
        <Image source={require(imgUrl)} style={{ width: ratio.width, height: ratio.height }} />
    )
}