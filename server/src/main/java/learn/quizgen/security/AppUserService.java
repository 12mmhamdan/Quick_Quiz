package learn.quizgen.security;

import learn.quizgen.data.AppUserRepository;
import learn.quizgen.models.AppUser;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.util.List;
import java.util.Optional;

@Service
public class AppUserService implements UserDetailsService {

    private final AppUserRepository repository;
    private final PasswordEncoder encoder;

    public AppUserService(AppUserRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> appUserOpt = repository.findByUsername(username);

        if (appUserOpt.isEmpty() || !appUserOpt.get().isEnabled()) {
            throw new UsernameNotFoundException(username + " not found");
        }

        return appUserOpt.get();
    }
    @Transactional
    public AppUser create(String firstName, String lastName, String username, String password, List<String> roles) {
        if (username == null || username.trim().isEmpty()) {
            throw new ValidationException("Username is required");
        }

        password = encoder.encode(password);

        AppUser appUser = new AppUser(0, firstName, lastName, username, password, false, roles);
        return repository.add(appUser);
    }

    @Transactional
    public boolean update(AppUser user) {
        return repository.update(user);
    }

    @Transactional
    public boolean deleteById(int id) {
        return repository.deleteById(id);
    }
}
