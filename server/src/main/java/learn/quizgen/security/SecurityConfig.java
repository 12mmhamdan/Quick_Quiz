package learn.quizgen.security;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtConverter converter;

    public SecurityConfig(JwtConverter converter) {
        this.converter = converter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();

        http.cors();

        http.authorizeRequests()
                // Allow preflight
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Auth & registration are public
                .antMatchers("/api/user/authenticate").permitAll()
                .antMatchers("/api/user/register").permitAll()
                .antMatchers("/api/user/**").permitAll()

                // ✅ NEW: AI endpoint – only Teachers can call it
                .antMatchers(HttpMethod.POST, "/api/ai/generate-quiz").hasRole("Teacher")
                // (If you ever add more AI endpoints, you can use: .antMatchers("/api/ai/**").hasRole("Teacher"))

                // Quizzes
                .antMatchers(HttpMethod.GET, "/api/quizzes", "/api/quizzes/*")
                .hasAnyRole("Teacher", "Student")
                .antMatchers("/api/quizzes/**").hasRole("Teacher")

                // Quiz results
                .antMatchers("/api/quiz-results").hasAnyRole("Teacher", "Student")

                // Questions
                .antMatchers("/api/questions").hasRole("Teacher")
                .antMatchers("/api/questions/**").hasAnyRole("Teacher", "Student")

                // Everything else under /api requires authentication
                .anyRequest().authenticated()
                .and()
                .addFilter(new JwtRequestFilter(authenticationManager(), converter))
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    @Bean
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    @Bean
    public PasswordEncoder getEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("https://quick-quiz-ecru.vercel.app")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
