import { MailtrapClient } from "mailtrap";

const TOKEN = "baf8b361ef7cad62f9ad88a35051559d";

export const client = new MailtrapClient({ token: TOKEN });
