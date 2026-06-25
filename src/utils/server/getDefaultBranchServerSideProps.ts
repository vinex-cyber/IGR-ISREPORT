// src/utils/server/getDefaultBranchServerSideProps.ts

import type { GetServerSideProps } from "next";

import type { DatabaseBranch } from "@/configs/database-options";

import {
  getBranchFromRequest,
  getClientIp,
} from "@/utils/server/getBranchFomRequest";

export interface DefaultBranchPageProps {
  defaultBranch: DatabaseBranch;
}

/**
 * Menghasilkan defaultBranch berdasarkan IP client.
 *
 * Dapat digunakan kembali pada seluruh halaman Pages Router.
 */
export const getDefaultBranchServerSideProps: GetServerSideProps<
  DefaultBranchPageProps
> = async ({ req }) => {
  const defaultBranch = getBranchFromRequest(req);

  /**
   * Log opsional untuk memastikan IP yang diterima.
   * Aktifkan melalui:
   *
   * DEBUG_CLIENT_IP=true
   */
  if (process.env.DEBUG_CLIENT_IP === "true") {
    console.log("[Client Branch Detection]", {
      xRealIp: req.headers["x-real-ip"],
      xForwardedFor: req.headers["x-forwarded-for"],
      socketIp: req.socket.remoteAddress,
      clientIp: getClientIp(req),
      defaultBranch,
    });
  }

  return {
    props: {
      defaultBranch,
    },
  };
};
