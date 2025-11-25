declare module 'expo-router' {
  import * as React from 'react';

  export type TabBarIconProps = {
    color?: string;
    size?: number;
    focused?: boolean;
  };

  export type ScreenOptions = {
    tabBarIcon?: (props: TabBarIconProps) => React.ReactNode;
    title?: string;
    headerShown?: boolean;
    [key: string]: any;
  };

  export const Tabs: React.FC<{ children?: React.ReactNode; screenOptions?: ScreenOptions }> & {
    Screen: React.FC<{ name?: string; options?: ScreenOptions }>;
  };

  export const Stack: React.FC<{ children?: React.ReactNode; screenOptions?: ScreenOptions }> & {
    Screen: React.FC<{ name?: string; options?: ScreenOptions }>;
  };

  // Minimal typed helpers used in this project
  export function useFocusEffect(effect: React.EffectCallback): void;

  export type Router = {
    push: (path: string) => void;
    replace?: (path: string) => void;
    back?: () => void;
    // add other router methods minimally as needed
  };

  export function useRouter(): Router;

  // Re-export types you need (if any) as `any` to keep this minimal
  export const Link: any;
  export const useSegments: any;
  export const useLocalSearchParams: any;
}
