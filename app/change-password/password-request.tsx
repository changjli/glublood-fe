import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { ForgotPasswordRequest, sendCodeRequest } from '@/hooks/api/auth/authTypes';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import useAuth from '@/hooks/api/auth/useAuth'
import VerifyCode from '@/app/forgot-password/verify-code'
import { router } from 'expo-router';
import CustomText from '@/components/CustomText';

type Password = {
  oldPassword: string,
  newPassword: string,
}

type SendCodeProps = {
  setPage: (value: number) => void
  setCredentials: (value: {
    email: string,
    password: string,
    code: string,
  }) => void
}

const passwordSchema = Yup.object({
  oldPassword: Yup.string().required('Password lama wajib diisi'),
  newPassword: Yup.string().required('Password baru wajib diisi'), 
})

const { width, height } = Dimensions.get("window");

export default function PasswordRequest({ setPage, setCredentials }: SendCodeProps) {
  const { forgotPassword, getAuthenticatedUser } = useAuth()
  const [ getUserLoading, setGetUserLoading] = useState<boolean>(false);
  const [ forgotPasswordLoading, setForgotPasswordLoading] = useState<boolean>(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<Password>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
    resolver: yupResolver(passwordSchema),
    mode: 'onChange',
  })

  const onSubmit = (data: any) => {
    console.log(data);
    // Add your logic to handle the form submission here
  };

  const handleForgotPasswword = async (id: ForgotPasswordRequest) => {
    try {
      const res = await forgotPassword(setForgotPasswordLoading, id)
      const data: ForgotPasswordRequest = res.data
      console.log("[ForgotPasswordRequest]: ", id)
      return res.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 400) {
            Alert.alert('Bad Request', 'Invalid request. Please check your input.');
        } else if (status === 500) {
            Alert.alert('Server Error', 'A server error occurred. Please try again later.');
        } else {
            // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
        }
      } else {
        console.log('Unexpected Error:', err);
        Alert.alert('Network Error', 'Please check your internet connection.');
      }

      return null
    }
  }

  const handleGetAuth = async (id: sendCodeRequest, newPass: string) => {
    try {
      const res = await getAuthenticatedUser(setGetUserLoading, id);
      const data: ForgotPasswordRequest = res.data
      if (res.status === 200) {
        setCredentials({ email: data.email, password: newPass, code: '' });
        handleForgotPasswword({email: data.email})
        setPage(2)
      }
      console.log("[ForgotPasswordRequest]: ", id)
      return res.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 400) {
            Alert.alert('Bad Request', 'Invalid request. Please check your input.');
        } else if (status === 500) {
            Alert.alert('Server Error', 'A server error occurred. Please try again later.');
        } else {
            // Alert.alert('Error', `An error occurred: ${status}. Please try again later.`);
        }
      } else {
        console.log('Unexpected Error:', err);
        Alert.alert('Network Error', 'Please check your internet connection.');
      }

      return null
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 20,
          paddingVertical: 15,
          paddingHorizontal: 20,
          backgroundColor: '#DA6E35',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back-outline' size={50} color='white' />
        </TouchableOpacity>
        <Text style={styles.title}>Ubah Kata Sandi</Text>
      </View>

      <View style={{ paddingHorizontal: 20, height: 670 }}>
        <Image
          source={require('@/assets/images/forgot-password/forgot.png')}
          style={ styles.img }
        />

        <Controller
          control={control}
          name="oldPassword"
          render={({ field: { onChange, value } }) => (
            <View>
              <Text style={styles.labelInput}>Kata sandi saat ini</Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    errors.oldPassword && styles.inputError,
                  ]}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Masukkan kata sandi lama"
                  secureTextEntry={!isOldPasswordVisible}
                />
                <TouchableOpacity
                  style={{ 
                      position: 'absolute',
                      top: 15,
                      right: 12,
                  }}
                  onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
                >
                  {
                    isOldPasswordVisible ? 
                      <Ionicons name='eye' size={20} color='#969696' />
                      :
                      <Ionicons name='eye-off' size={20} color='#969696' />
                  }
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        {errors.oldPassword && (
          <Text style={styles.errorText}>{errors.oldPassword.message}</Text>
        )}

        <View style={{ height: 100 }}>
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={styles.labelInput}>Kata sandi terbaru</Text>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      errors.newPassword && styles.inputError,
                    ]}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Masukkan kata sandi baru"
                    secureTextEntry={!isNewPasswordVisible}
                  />
                  <TouchableOpacity
                    style={{ 
                        position: 'absolute',
                        top: 15,
                        right: 12,
                    }}
                    onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  >
                    {
                      isNewPasswordVisible ? 
                        <Ionicons name='eye' size={20} color='#969696' />
                        :
                        <Ionicons name='eye-off' size={20} color='#969696' />
                    }
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          {errors.newPassword && (
            <Text style={[styles.errorText, {marginBottom: 0}]}>{errors.newPassword.message}</Text>
          )}

          <TouchableOpacity
            style={{ 
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
            onPress={() => router.push("/forgot-password/")}
          >
            <CustomText
              size="sm"
              weight="heavy"
              style={{
                color: '#DA6E35'
              }}
            >
              Lupa kata sandi?
            </CustomText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit((data) => {
            const passRequest: sendCodeRequest = {
                email: 'a',
                password: data.oldPassword,
            };
            handleGetAuth(passRequest, data.newPassword);
          })}
        >
          <Text style={styles.buttonText}>Konfirmasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: -6,
    color: 'white',
    fontSize: 32,
    fontFamily: 'Helvetica-Bold'
  },
  img: {
    marginHorizontal: 'auto',
    marginBottom: 5,
    width: 330,
    height: 150,
    objectFit: 'cover',
  },
  labelInput: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: -5,
    marginBottom: 8,
    color: 'red',
  },
  button: {
    marginTop: 'auto',
    height: 60,
    backgroundColor: '#DA6E35',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold'
  },
});