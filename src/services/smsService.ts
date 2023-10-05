import db from "../models";

const Account = db.Account;
const PhoneNumber = db.PhoneNumber;

export const authenticateAccount = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const accountExists = await Account.findOne({
    //@ts-ignore
    where: { username: username, auth_id: password },
  });

  return accountExists;
};

export const findrByIdAndPhoneNumber = async (
  id: number,
  phoneNumber: string
) => {
  return await PhoneNumber.findOne({
    where: {
      number: phoneNumber,
      account_id: id,
    },
  });
};
