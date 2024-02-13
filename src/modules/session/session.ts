export interface ISession {
  createNewSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ): Promise<void>;

  createSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ): Promise<void>;

  deleteSession(deviceUUID: string): Promise<{ success: boolean }>;

  updateSession(
    refreshToken: string,
    deviceUUID: string,
    userUUID: string,
    accessTokenUUID: string,
    oldAccessToken: string,
  ): Promise<void>;
}
