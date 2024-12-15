import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { changePasswordRequest, ForgotPasswordRequest, sendCodeRequest } from '@/hooks/api/auth/authTypes';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import useAuth from '@/hooks/api/auth/useAuth'
import VerifyCode from '@/app/forgot-password/verify-code'
import { router } from 'expo-router';
import CustomText from '@/components/CustomText';
import { useCustomAlert } from '../context/CustomAlertProvider';
import CustomHeader from '@/components/CustomHeader';
import Wrapper from '@/components/Layout/Wrapper';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import { Colors } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';

type ChangePassword = {
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
  const { forgotPassword, changePassword } = useAuth()
  const [getUserLoading, setGetUserLoading] = useState<boolean>(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState<boolean>(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const { showAlert } = useCustomAlert()

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<ChangePassword>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
    resolver: yupResolver(passwordSchema),
    mode: 'onChange',
  })

  const handleForgotPasswword = async (id: ForgotPasswordRequest) => {
    try {
      const res = await forgotPassword(setForgotPasswordLoading, id)
      if (res.status == 200) {
        setPage(2)
      } else if (res.status == 400) {
        console.log(res.message);
        showAlert(res.message, "error");
      }

    } catch (err) {
      console.log("Axios Error:", err);
      showAlert("Error: Please try again later", "error");
    }
  }

  const handleChangePassword = async (payload: changePasswordRequest, newPassword: string) => {
    try {
      const res = await changePassword(setGetUserLoading, payload);
      if (res.status == 200) {
        const data = res.data
        setCredentials({ email: data.email, password: newPassword, code: '' })
        handleForgotPasswword({ email: data.email })
      } else if (res.status == 400) {
        console.log(res.message);
        showAlert(res.message, "error");
      }
    } catch (err) {
      console.log("Axios Error:", err);
      showAlert("Error: Please try again later", "error");
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title='Ubah kata sandi' />

      <Wrapper style={{ backgroundColor: 'white', justifyContent: 'space-between' }}>
        <View>
          <Image
            source={require('@/assets/images/forgot-password/forgot.png')}
            style={styles.img}
          />

          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange, value } }) => (
              <CustomTextInput
                label='Kata sandi saat ini'
                placeholder='Masukkan kata sandi lama'
                value={value}
                onChangeText={onChange}
                postfix={
                  <TouchableOpacity
                    onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
                  >
                    {
                      isOldPasswordVisible ?
                        <Ionicons name='eye-off' size={20} color='#969696' />
                        :
                        <Ionicons name='eye' size={20} color='#969696' />
                    }
                  </TouchableOpacity>
                }
                error={
                  errors.oldPassword ? errors.oldPassword.message : ""
                }
                secureTextEntry={!isOldPasswordVisible}
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <CustomTextInput
                label='Kata sandi saat ini'
                placeholder='Masukkan kata sandi lama'
                value={value}
                onChangeText={onChange}
                postfix={
                  <TouchableOpacity
                    onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  >
                    {
                      isNewPasswordVisible ?
                        <Ionicons name='eye-off' size={20} color='#969696' />
                        :
                        <Ionicons name='eye' size={20} color='#969696' />
                    }
                  </TouchableOpacity>
                }
                error={
                  errors.newPassword ? errors.newPassword.message : ""
                }
                secureTextEntry={!isNewPasswordVisible}
              />
            )}
          />

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
            onPress={() => router.push("/forgot-password/")}
          >
            <CustomText
              size="sm"
              weight="heavy"
              style={{
                color: Colors.light.primary,
              }}
            >
              Lupa kata sandi?
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomButton
          size='md'
          title='Konfirmasi'
          onPress={handleSubmit((data) => handleChangePassword({ password: data.oldPassword }, data.newPassword))}
          style={{ marginBottom: 20 }}
          loading={getUserLoading || forgotPasswordLoading}
        />
      </Wrapper>
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
    width: '100%',
    height: 150,
  },
});