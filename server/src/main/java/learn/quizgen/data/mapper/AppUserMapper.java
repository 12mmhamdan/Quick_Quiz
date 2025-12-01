package learn.quizgen.data.mapper;

import learn.quizgen.models.AppUser;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class AppUserMapper implements RowMapper<AppUser> {

    private final List<String> roles;

    public AppUserMapper(List<String> roles) {
        this.roles = roles;
    }

    @Override
    public AppUser mapRow(ResultSet rs, int i) throws SQLException {
        // Extract fields from the ResultSet and construct the AppUser object
        return new AppUser(
                rs.getInt("user_id"),               // User ID
                rs.getString("first_name"),         // First Name
                rs.getString("last_name"),          // Last Name
                rs.getString("username"),           // Username
                rs.getString("password"),           // Password
                rs.getBoolean("disabled"),          // Disabled status
                roles                               // Roles from the provided list
        );
    }
}
