package learn.quizgen.data;

import learn.quizgen.models.AppUser;

import java.util.Optional;

public interface AppUserRepository {

    Optional<AppUser> findByUsername(String username); // Use Optional to handle null more cleanly

    AppUser add(AppUser user);

    boolean update(AppUser user);

    boolean deleteById(int id);
}
