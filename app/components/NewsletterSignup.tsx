import MailchimpSubscribe from "react-mailchimp-subscribe"
import { Button } from "./Button";
import { Text } from "./Text"
import { Link } from "./Link";
import IconHelp from "./IconHelp";
import IconPolicy from "./IconPolicy";
const url = "https://lzxindustries.us11.list-manage.com/subscribe/post?u=7da8b11822c70e5b64240e14f&amp;id=352bd533b6&amp;f_id=0076a2e0f0";

// simplest form (only email)
export const NewsletterSignup = () =>
  <div className="grid gap-4">
    <Text size="lead">Sign up for our newsletter!</Text><Text size="copy" className="text-gray-400"><MailchimpSubscribe url={url} /></Text>
    <div className="grid gap-4">
      <div className="grid gap-4"> <Link target="_blank" to="https://us11.campaign-archive.com/home/?u=7da8b11822c70e5b64240e14f&id=352bd533b6"><IconPolicy className="inline-block align-middle" /> <Text className="inline-block align-middle">LZX Newsletter Archive </Text></Link></div>
      <div className="grid gap-4"> <Link target="_blank" to="/policies/terms-of-service"><IconPolicy className="inline-block align-middle" /> <Text className="inline-block align-middle">Terms of Service </Text></Link></div>
      <div className="grid gap-4"> <Link target="_blank" to="/policies/refund-policy"><IconPolicy className="inline-block align-middle" /> <Text className="inline-block align-middle">Refund Policy </Text></Link></div>
    </div>
  </div>

export default NewsletterSignup
