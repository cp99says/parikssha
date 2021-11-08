import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {AuthStackNavigator} from './src/Navigation/AuthNavigators/AuthNavigator';
import {HomeStackNavigator} from './src/Navigation/HomeNavigators/HomeNavigator';
import {Observer} from 'mobx-react';
import {BottomTab} from './src/Navigation/BottomTabNavigator/BottomTabNavigator';
import Store from './src/Store/Store';
import {FocusAwareStatusBar, getData} from './src/Functions/AppFunctions';
import {Loader} from './src/Components/Components';

function App() {
  const [loading, setLoading] = useState(true);
  async function initPageLoadingEvents() {
    const authState = await getData('authState');
    const userName = await getData('userName');
    const teacherId = await getData('teacherId');

    console.log(authState);
    if (authState) {
      Store.setTeacherIdVal(teacherId);
      Store.setUsernameVal(userName);
      setLoading(false);
      Store.setAuthTokenVal(1);
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    initPageLoadingEvents();
  }, []);

  return loading ? (
    <>
      <Loader />
    </>
  ) : (
    <Observer>
      {() => (
        <NavigationContainer>
          {Store.authTokenVal == 0 ? <AuthStackNavigator /> : <BottomTab />}
        </NavigationContainer>
      )}
    </Observer>
  );
}

export default App;
