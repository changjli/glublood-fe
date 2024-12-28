import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { ForgotPasswordRequest } from '@/hooks/api/auth/authTypes';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import useAuth from '@/hooks/api/auth/useAuth'
import VerifyCode from '@/app/forgot-password/verify-code'
import { router } from 'expo-router';
import { useCustomAlert } from '../context/CustomAlertProvider';
import { FontSize } from '@/constants/Typography';
import CustomButton from '@/components/CustomButton';
import CustomTextInput from '@/components/CustomInput/CustomTextInput';
import WithKeyboard from '@/components/Layout/WithKeyboard';

type SendCodeProps = {
  setPage: (value: number) => void
  setCredentials: (value: {
    email: string,
    password: string,
    code: string,
  }) => void
}

const emailSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
})

export default function EmailRequest({ setPage, setCredentials }: SendCodeProps) {
  const { forgotPassword } = useAuth()
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState<boolean>(false);
  const { showAlert } = useCustomAlert()
  const { height } = useWindowDimensions()


  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<ForgotPasswordRequest>({
    defaultValues: { email: '' },
    resolver: yupResolver(emailSchema),
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
      if (res.status === 200) {
        setCredentials({ email: id.email, password: '', code: '' });
        setPage(2)
      } else if (res.status == 400) {
        console.log(res.message);
        showAlert(res.message, "error");
      }
      return res.data
    } catch (err) {
      console.log("Axios Error:", err);
      showAlert("Error: Please try again later", "error");
      return null
    }
  }

  return (
    <WithKeyboard>
      <View style={[styles.container, { height: height }]}>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
        >
          <Ionicons name='arrow-back-outline' size={FontSize['2xl']} color='Black' />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Lupa kata sandi</Text>
          <Text style={styles.subtitle}>Masukkan email anda untuk menerima kata sandi</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Image
              source={require('@/assets/images/forgot-password/forgot.png')}
              style={styles.img}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label='Email'
                  placeholder='email'
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  error={errors.email ? errors.email.message : ''}
                />
              )}
            />
          </View>
          <CustomButton
            title='Kirim tautan'
            onPress={handleSubmit(handleForgotPasswword)}
            loading={forgotPasswordLoading}
          />
        </View>
      </View>
    </WithKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },
  title: {
    marginBottom: -6,
    fontSize: FontSize['2xl'],
    fontFamily: 'Helvetica-Bold'
  },
  subtitle: {
    marginBottom: 16,
    color: '#969696',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  img: {
    marginHorizontal: 'auto',
    marginBottom: 5,
    width: '100%',
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
    color: 'red',
    marginBottom: 8,
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