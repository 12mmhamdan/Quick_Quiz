package learn.quizgen.data;

import learn.quizgen.data.mapper.AppUserMapper;
import learn.quizgen.models.AppUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public class AppUserRepositoryJdbcTemplate implements AppUserRepository {

    private final JdbcTemplate jdbcTemplate;

    public AppUserRepositoryJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public Optional<AppUser> findByUsername(String username) {
        List<String> roles = getRolesByUsername(username);

        final String sql = "SELECT user_id, first_name, last_name, username, password, disabled "
                + "FROM app_user "
                + "WHERE username = ?;";

        return jdbcTemplate.query(sql, new AppUserMapper(roles), username)
                .stream()
                .findFirst();  // This returns Optional<AppUser>
    }

    @Override
    @Transactional
    public AppUser add(AppUser user) {
        final String sql = "INSERT INTO app_user (first_name, last_name, username, password, disabled) "
                + "VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"user_id"});
            ps.setString(1, user.getFirstName());
            ps.setString(2, user.getLastName());
            ps.setString(3, user.getUsername());
            ps.setString(4, user.getPassword());
            ps.setBoolean(5, user.isDisabled());
            return ps;
        }, keyHolder);

        user.setAppUserId(keyHolder.getKey().intValue()); // Set the generated user_id to the AppUser object

        // Handle roles after user creation
        updateRoles(user);

        return user;
    }

    @Override
    @Transactional
    public boolean update(AppUser user) {
        final String sql = "UPDATE app_user SET first_name = ?, last_name = ?, username = ?, password = ?, disabled = ? "
                + "WHERE user_id = ?";
        boolean updated = jdbcTemplate.update(sql,
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getPassword(),
                user.isDisabled(),
                user.getAppUserId()) > 0;

        if (updated) {
            // Update roles after user details are updated
            updateRoles(user);
        }

        return updated;
    }

    @Override
    public boolean deleteById(int id) {
        final String sql = "DELETE FROM app_user WHERE user_id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

    private void updateRoles(AppUser user) {
        // Delete old roles
        jdbcTemplate.update("DELETE FROM user_role WHERE user_id = ?;", user.getAppUserId());

        Collection<GrantedAuthority> authorities = user.getAuthorities();

        if (authorities == null || authorities.isEmpty()) {
            return;
        }

        // Insert new roles
        for (String role : AppUser.convertAuthoritiesToRoles(authorities)) {
            String sql = "INSERT INTO user_role (user_id, role_id) "
                    + "SELECT ?, role_id FROM role WHERE name = ?";

            int rowsAffected = jdbcTemplate.update(sql, user.getAppUserId(), role);
            if (rowsAffected == 0) {
                throw new RuntimeException("Role " + role + " does not exist.");
            }
        }
    }

    private List<String> getRolesByUsername(String username) {
        final String sql = "SELECT r.name "
                + "FROM user_role ur "
                + "INNER JOIN role r ON ur.role_id = r.role_id "
                + "INNER JOIN app_user au ON ur.user_id = au.user_id "
                + "WHERE au.username = ?";

        return jdbcTemplate.query(sql, (rs, rowId) -> rs.getString("name"), username);
    }
}
