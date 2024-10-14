package com.urambank.uram.config;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageServiceConfig {

    @Bean
    public DefaultMessageService messageService() {
        return NurigoApp.INSTANCE.initialize(
                "NCSWFN2OVSKW3MPS",  // 발급받은 api_key
                "P9YBFDGTRQNVQ2KXSP7NGF1BE7PLX5DP",  // 발급받은 api_secret
                "https://api.coolsms.co.kr"  // API URL
        );
    }
}