import {
    View,
    Text,
    Modal,
    StyleSheet,
    Pressable,
    FlatList,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity,
    Easing,
    Switch,
    useWindowDimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "../context/AuthenticationProvider";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import Wrapper from "@/components/Layout/Wrapper";
import CustomText from "@/components/CustomText";
import { Colors } from "@/constants/Colors";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
    formatDateIntl,
    formatDatetoStringYmd,
} from "@/utils/formatDatetoString";
import { FlexStyles } from "@/constants/Flex";
import useFoodMenu from "@/hooks/api/food_menu/useFoodMenu";
import axios from "axios";
import useDailyCalories from "@/hooks/api/daily_calories/useDailyCalories";
import { FontSize } from "@/constants/Typography";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { parseGlucoseReading } from "@/app/ble/GlucoseReadingRx";
import { useCustomAlert } from "../context/CustomAlertProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import Avatar from "@/components/Avatar";
import useReminder, { ReminderStorage } from "@/hooks/useReminder";

export default function HomePage() {
    const { signOut, session } = useSession();
    const { getAllFoodMenu } = useFoodMenu();
    const { getDailyCaloriesByDate, getDailyBurnedCaloriesByDate } =
        useDailyCalories();
    const { getAllKeys, getAllObjectData, storeObjectData } = useAsyncStorage();
    const { width } = useWindowDimensions();
    const { showAlert } = useCustomAlert()
    const { profile } = useUserProfile()
    const { getAllReminder } = useReminder()

    const today = new Date()
    const [foodMenus, setFoodMenus] = useState<FoodMenu[]>([])
    const [dailyCalories, setDailyCalories] = useState<GetDailyCaloriesResponse | null>(null)
    const [dailyBurnedCalories, setDailyBurnedCalories] = useState<{ avg_burned_calories: number } | null>(null)
    const [getAllFoodMenuLoading, setGetAllFoodMenuLoading] = useState(false)
    const [getDailyCaloriesLoading, setGetDailyCaloriesLoading] = useState(false)
    const [getDailyCaloriesBurnedLoading, setDailyCaloriesBurnedLoading] = useState(false)
    const dailyCaloriesCircularProgressRef = useRef(null)
    const dailyBurnedCaloriesCircularProgressRef = useRef(null)
    const [reminders, setReminders] = useState<ReminderStorage[]>([]);

    const handleGetAllFoodMenu = async () => {
        try {
            const res = await getAllFoodMenu(setGetAllFoodMenuLoading, "", 3);
            setFoodMenus(res.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert(
                        "Bad Request",
                        "Invalid request. Please check your input."
                    );
                } else if (status === 500) {
                    Alert.alert(
                        "Server Error",
                        "A server error occurred. Please try again later."
                    );
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log("Unexpected Error:", err);
                Alert.alert(
                    "Network Error",
                    "Please check your internet connection."
                );
            }
            return [];
        }
    };

    const handleGetDailyCalories = async (date: string) => {
        try {
            const res = await getDailyCaloriesByDate(
                setGetDailyCaloriesLoading,
                date
            );
            const data: GetDailyCaloriesResponse = res.data;
            setDailyCalories(data);
        } catch (err) {
            setDailyCalories(null);
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert(
                        "Bad Request",
                        "Invalid request. Please check your input."
                    );
                } else if (status === 500) {
                    Alert.alert(
                        "Server Error",
                        "A server error occurred. Please try again later."
                    );
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log("Unexpected Error:", err);
                Alert.alert(
                    "Network Error",
                    "Please check your internet connection."
                );
            }
        }
    };

    const handleGetDailyBurnedCalories = async (date: string) => {
        try {
            const res = await getDailyBurnedCaloriesByDate(
                setDailyCaloriesBurnedLoading,
                date
            );
            const data = res.data;
            setDailyBurnedCalories(data);
        } catch (err) {
            setDailyBurnedCalories(null);
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 400) {
                    Alert.alert(
                        "Bad Request",
                        "Invalid request. Please check your input."
                    );
                } else if (status === 500) {
                    Alert.alert(
                        "Server Error",
                        "A server error occurred. Please try again later."
                    );
                } else {
                    // showAlert(`An error occurred: ${status}. Please try again later.`, 'error');
                }
            } else {
                console.log("Unexpected Error:", err);
                Alert.alert(
                    "Network Error",
                    "Please check your internet connection."
                );
            }
        }
    };

    const handleGetAllReminder = async () => {
        const res = await getAllReminder(() => { })
        setReminders(res)
    }

    useEffect(() => {
        handleGetAllFoodMenu();
        handleGetDailyCalories(formatDatetoStringYmd(today));
        handleGetDailyBurnedCalories(formatDatetoStringYmd(today));
        handleGetAllReminder();
    }, []);

    useEffect(() => {
        if (dailyCalories && dailyBurnedCalories) {
            if (dailyCaloriesCircularProgressRef.current) {
                dailyCaloriesCircularProgressRef.current.animate(
                    (dailyCalories.consumed_calories /
                        dailyCalories.target_calories) *
                    100,
                    500,
                    Easing.quad
                );
            }
            if (dailyBurnedCaloriesCircularProgressRef.current) {
                dailyBurnedCaloriesCircularProgressRef.current.animate(dailyBurnedCalories.avg_burned_calories / dailyCalories.target_calories * 100, 500, Easing.quad)
            }
        }
    }, [dailyCalories]);

    // useEffect(() => {
    //     if (dailyCalories && dailyBurnedCalories) {
    //         if (dailyBurnedCaloriesCircularProgressRef.current) {
    //             dailyBurnedCaloriesCircularProgressRef.current.animate(dailyBurnedCalories.avg_burned_calories / dailyCalories.target_calories * 100, Easing.quad)
    //         }
    //     }
    // }, [dailyBurnedCalories])

    const mapReminderType = (value: number) => {
        switch (value) {
            case 1:
                return "Gula Darah";
            case 2:
                return "Obat";
            case 3:
                return "Olahraga";
        }
    };

    const dayMapping: { [key: number]: string } = {
        1: "Minggu",
        2: "Senin",
        3: "Selasa",
        4: "Rabu",
        5: "Kamis",
        6: "Jumat",
        7: "Sabtu",
    };

    // Render reminder item
    const renderItem = ({ item }: { item: ReminderStorage }) => (
        <TouchableOpacity
            style={styles.reminderCard}
            onPress={() => router.navigate(`/reminder/${item.id}`)}
        >
            <View style={styles.reminderLeft}>
                <View style={styles.categoryContainer}>
                    {item.reminderTypes.map((type, index) => (
                        <Text key={index} style={styles.category}>
                            {mapReminderType(type)}
                        </Text>
                    ))}
                </View>

                <Text style={styles.time}>{item.time}</Text>

                {item.notes && (
                    <Text style={styles.days}>
                        {item.notes.length > 23
                            ? [item.notes.slice(0, 25), " ..."]
                            : item.notes}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView>
                <View style={styles.headerContainer} />
                <Wrapper>
                    {/* header */}
                    <View style={{ marginBottom: 12 }}>
                        <View
                            style={[
                                FlexStyles.flexRow,
                                { justifyContent: "space-between" },
                            ]}
                        >
                            <CustomText
                                size="xl"
                                weight="heavy"
                                style={{ color: "white" }}
                            >
                                Glublood
                            </CustomText>
                            <TouchableOpacity
                                onPress={() => router.push("/profile/")}
                            >
                                {(profile?.profile_image) ? (
                                    <Image
                                        source={{ uri: process.env.EXPO_PUBLIC_API_URL + profile.profile_image }}
                                        style={styles.profile}
                                    />
                                ) : (
                                    <Avatar name={profile?.firstname ? `${profile?.firstname} ${profile?.lastname ?? ''}` : ''} size={40} />
                                )}
                            </TouchableOpacity>
                        </View>
                        <CustomText style={{ color: "white", maxWidth: "70%" }}>
                            Hai, <CustomText weight="heavy">{profile?.firstname}</CustomText> jaga kesehatan dan perbanyak aktivitas
                            tubuh
                        </CustomText>
                    </View>

                    {/* summary */}
                    <View style={styles.summaryContainer}>
                        <AnimatedCircularProgress
                            ref={dailyBurnedCaloriesCircularProgressRef}
                            size={170}
                            width={20}
                            fill={dailyCalories && dailyBurnedCalories ? dailyBurnedCalories.avg_burned_calories / dailyCalories.target_calories * 100 : 0}
                            tintColor={'rgba(171,0,0,1)'}
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor={'rgba(171,0,0,0.2)'}
                            rotation={0}
                            lineCap="round"
                            children={() => (
                                <AnimatedCircularProgress
                                    ref={dailyCaloriesCircularProgressRef}
                                    size={130}
                                    width={20}
                                    fill={
                                        dailyCalories
                                            ? (dailyCalories.consumed_calories /
                                                dailyCalories.target_calories) *
                                            100
                                            : 0
                                    }
                                    tintColor={"rgba(218,110,53,1)"}
                                    onAnimationComplete={() =>
                                        console.log("onAnimationComplete")
                                    }
                                    backgroundColor={"rgba(218,110,53,0.2)"}
                                    rotation={0}
                                    lineCap="round"
                                    children={() => (
                                        <Image
                                            source={require("@/assets/images/icons/kembar.png")}
                                            style={{ width: 60 }}
                                            resizeMode="contain"
                                        />
                                    )}
                                />
                            )}
                        />

                        <View style={styles.summaryInnerContainer}>
                            <View style={styles.todayContainer}>
                                <CustomText style={{ textAlign: "center" }}>
                                    {formatDateIntl(today)}
                                </CustomText>
                            </View>
                            <View>
                                <View style={[FlexStyles.flexRow, { gap: 8 }]}>
                                    <View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            backgroundColor:
                                                Colors.light.primary,
                                        }}
                                    />
                                    <CustomText
                                        size="sm"
                                        style={{ color: Colors.light.primary }}
                                    >
                                        Asupan kalori
                                    </CustomText>
                                </View>
                                <View style={[FlexStyles.flexRow, { gap: 8 }]}>
                                    <View
                                        style={{
                                            width: 12,
                                            height: 12,
                                            backgroundColor: Colors.light.red,
                                        }}
                                    />
                                    <CustomText
                                        size="sm"
                                        style={{ color: Colors.light.red }}
                                    >
                                        Pembakaran kalori
                                    </CustomText>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* remainder */}
                    <View style={{ marginBottom: 16 }}>
                        {reminders && reminders.length > 0 ? (
                            <View>
                                <View
                                    style={{
                                        marginTop: 15,
                                        ...FlexStyles.flexRow,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <CustomText size="lg" weight="heavy">
                                        Reminder
                                    </CustomText>
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push("/reminder")
                                        }
                                    >
                                        <CustomText
                                            size="sm"
                                            weight="heavy"
                                            style={{ color: "#DA6E35" }}
                                        >
                                            Lihat Selengkapnya
                                        </CustomText>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={reminders.slice(0, 3)}
                                    renderItem={renderItem}
                                    maxToRenderPerBatch={2}
                                    initialNumToRender={1}
                                    keyExtractor={(item) => item.time}
                                />
                            </View>
                        ) : (
                            <View>
                                <CustomText
                                    size="lg"
                                    weight="heavy"
                                    style={{ marginTop: 15 }}
                                >
                                    Reminder
                                </CustomText>
                                <View style={styles.reminderContainer}>
                                    <View style={styles.empytReminderContainer}>
                                        <Image
                                            source={require("@/assets/images/characters/character-report.png")}
                                            style={{ height: 80, resizeMode: 'contain' }}
                                        />
                                        <CustomText
                                            size="sm"
                                            style={{
                                                color: Colors.light.gray400,
                                                textAlign: "center",
                                                fontSize: 16,
                                            }}
                                        >
                                            Kamu belum tambah pengigat
                                        </CustomText>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 10,
                                            padding: 12,
                                            width: 200,
                                            borderWidth: 1,
                                            borderColor: "#DA6E35",
                                            borderRadius: 8,
                                            ...FlexStyles.flexRow,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onPress={() =>
                                            router.push("/reminder")
                                        }
                                    >
                                        <View
                                            style={{
                                                marginRight: 5,
                                                width: 14,
                                                height: 14,
                                                backgroundColor: "#DA6E35",
                                                borderRadius: 3,
                                                ...FlexStyles.flexCol,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Image
                                                source={require("@/assets/images/icons/plus.png")}
                                                style={{
                                                    width: 6,
                                                    height: 6,
                                                    tintColor: "white",
                                                }}
                                            />
                                        </View>
                                        <CustomText
                                            size="sm"
                                            style={{
                                                color: "#DA6E35",
                                                textAlign: "center",
                                                fontSize: 12,
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            Tambahkan pengingat
                                        </CustomText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* menu */}
                    <View style={{ marginBottom: 12 }}>
                        <View
                            style={[
                                FlexStyles.flexRow,
                                { justifyContent: "space-between" },
                            ]}
                        >
                            <CustomText size="lg" weight="heavy">
                                Menu Sehat
                            </CustomText>
                            <TouchableOpacity
                                onPress={() => router.push("/food-menus")}
                            >
                                <CustomText
                                    size="sm"
                                    weight="heavy"
                                    style={{ color: Colors.light.primary }}
                                >
                                    Lihat Selengkapnya
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={foodMenus}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={styles.foodItemContainer}
                                    id={String(index)}
                                    onPress={() =>
                                        router.push(`/food-menus/${item.id}`)
                                    }
                                >
                                    <CustomText
                                        size="sm"
                                        weight="heavy"
                                        style={{ textAlign: "center" }}
                                    >
                                        {item.title}
                                    </CustomText>
                                    <CustomText size="sm">
                                        {item.calories} Kal
                                    </CustomText>
                                    <Image
                                        source={{
                                            uri: `${process.env.EXPO_PUBLIC_API_URL}${item.image}`
                                        }}
                                        style={styles.foodItemImage}
                                    />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            contentContainerStyle={{ gap: 12, padding: 8 }}
                        />
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <CustomText size="lg" weight="heavy">
                            Laporan Data
                        </CustomText>
                        <View style={styles.reminderContainer}>
                            <View style={styles.empytReminderContainer}>
                                <Image
                                    source={require("@/assets/images/characters/icon-laporan.png")}
                                    style={{ height: 80, resizeMode: 'contain' }}
                                />
                                <CustomText
                                    size="sm"
                                    style={{
                                        color: Colors.light.gray400,
                                        textAlign: "center",
                                        fontSize: 16,
                                    }}
                                >
                                    Laporan kesehatanmu mengenai diabetes dan
                                    aktivitas yang dilakukan
                                </CustomText>
                            </View>
                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    padding: 12,
                                    width: 200,
                                    borderWidth: 1,
                                    borderColor: "#DA6E35",
                                    borderRadius: 8,
                                    ...FlexStyles.flexRow,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() => router.push("/report")}
                            >
                                <View
                                    style={{
                                        marginRight: 5,
                                        width: 14,
                                        height: 14,
                                        backgroundColor: "#DA6E35",
                                        borderRadius: 3,
                                        ...FlexStyles.flexCol,
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        source={require("@/assets/images/icons/plus.png")}
                                        style={{
                                            width: 6,
                                            height: 6,
                                            tintColor: "white",
                                        }}
                                    />
                                </View>
                                <CustomText
                                    size="sm"
                                    style={{
                                        color: "#DA6E35",
                                        textAlign: "center",
                                        fontSize: 12,
                                        fontFamily: "Helvetica-Bold",
                                    }}
                                >
                                    Lihat laporan
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {profile?.is_diabetes && (
                        <View>
                            <CustomText size="lg" weight="heavy">
                                Konfigurasi Alat
                            </CustomText>
                            <TouchableOpacity onPress={() => router.push("/ble")}>
                                <Image
                                    source={require("@/assets/images/static/content-accu-check.png")}
                                    style={{
                                        width: "100%",
                                        height: 125,
                                        borderRadius: 16,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </Wrapper>
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: Colors.light.primary,
        width: "100%",
        height: 150,
        position: "absolute",
    },
    summaryContainer: {
        backgroundColor: "white",
        elevation: 5,
        padding: 16,
        borderRadius: 16,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    summaryInnerContainer: {
        gap: 32,
    },
    todayContainer: {
        borderWidth: 1,
        borderColor: Colors.light.gray300,
        borderRadius: 8,
        padding: 8,
    },
    foodItemContainer: {
        width: 150,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 10,
        gap: 10,
        borderRadius: 10,
        elevation: 5,
    },
    foodItemImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    empytReminderContainer: {
        ...FlexStyles.flexCol,
        alignItems: "center",
    },
    reminderContainer: {
        ...FlexStyles.flexCol,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 10,
        padding: 8,
    },
    reportContainer: {
        ...FlexStyles.flexCol,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.light.primary,
        padding: 8,
    },
    profile: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    // reminder
    reminderCard: {
        width: 250,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FDF6EF",
        marginRight: 20,
        marginVertical: 5,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    reminderLeft: {
        flex: 1,
    },
    categoryContainer: {
        flexDirection: "row",
        marginBottom: 5,
    },
    category: {
        backgroundColor: "#f4a261",
        color: "white",
        fontWeight: "bold",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        marginRight: 5,
    },
    time: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        color: "#555",
        fontSize: 14,
    },
    days: {
        color: "#555",
        fontSize: 14,
        marginTop: 4,
    },
});
