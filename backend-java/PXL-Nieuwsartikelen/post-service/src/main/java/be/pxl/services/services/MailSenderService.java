package be.pxl.services.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailSenderService implements IMailSenderService {

    @Value("${spring.mail.username}")
    private String mailFrom;

    @Autowired
    private JavaMailSender javaMailSender;

    private static final Logger log = LoggerFactory.getLogger(MailSenderService.class);

    @Override
    public void sendNotificationMail(String subject, String text) {
        log.info("Placing subject: {} and text: {} into mail properties.", subject, text);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("jitske1.lenaerts@gmail.com");
        message.setFrom(mailFrom);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }
}
