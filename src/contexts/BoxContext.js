import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";

const BoxContext = createContext();
const { BoxProvider } = BoxContext;
