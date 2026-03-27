import React, {useCallback, useContext, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Snackbar} from 'react-native-paper';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {colors} from '../../ui';

type NotificationType = 'success' | 'error';

type SnackbarContextType = {
  showSnackbar: (text: string, type?: NotificationType) => void;
} | null;

const SnackbarContext = React.createContext<SnackbarContextType>(null);

const DEFAULT_SNACKBAR_DURATION: number = 2800;

type SnackbarContextProviderProps = {children: React.ReactNode};

export const SnackbarContextProvider = ({
  children,
}: SnackbarContextProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [notificationType, setNotificationType] =
    useState<NotificationType>('success');
  const [iconName, setIconName] = useState<string>('check-circle-outline');
  const [testID, setTestID] = useState<string | undefined>(undefined);
  const [key, setKey] = useState<number>(-1);
  const {top} = useSafeAreaInsets();

  const onDismissSnackBar = useCallback(() => {
    setVisible(false);
  }, []);

  const backgroundColors = useMemo(() => {
    return {
      success: colors.primary.ivory,
      error: colors.secondary.blushPink,
    };
  }, []);

  const textColor = useMemo(() => {
    return {
      success: colors.grayscale.deepGray,
      error: colors.secondary.crimsonRed,
    };
  }, []);

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar(newText, maybeType) {
          const type = maybeType ?? 'success';

          setKey(Date.now());
          setText(newText);
          setNotificationType(type);
          setIconName(getIconName(type));
          setTestID(
            type === 'success'
              ? 'productDetailsScreen.addedToCartSuccessSnackbar'
              : 'productDetailsScreen.addedToCartErrorSnackbar',
          );
          setVisible(true);
        },
      }}>
      {children}
      <Snackbar
        key={key}
        testID={testID}
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={DEFAULT_SNACKBAR_DURATION}
        wrapperStyle={{top}}
        style={[
          styles.container,
          {backgroundColor: backgroundColors[notificationType]},
        ]}>
        <View style={styles.content}>
          <Icon size={30} name={iconName} style={styles.icon} />
          {/* @ts-ignore */}
          <Text style={[styles.text, {color: textColor[notificationType]}]}>
            {text}
          </Text>
        </View>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

const getIconName = (notificationType: NotificationType) => {
  switch (notificationType) {
    case 'success':
      return 'check-circle-outline';
    case 'error':
      return 'alert';
    default:
      return 'check-circle-outline';
  }
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (context == null) {
    throw new Error(
      'useSnackbarContext must be used within a SnackbarContextProvider',
    );
  }

  return context;
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 35,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});
