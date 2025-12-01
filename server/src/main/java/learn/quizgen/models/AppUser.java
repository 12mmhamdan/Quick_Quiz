package learn.quizgen.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class AppUser extends User {

    private int userId;
    private String firstName;
    private String lastName;
    private boolean disabled;
    private List<Score> scores = new ArrayList<>();
    private List<String> roles = new ArrayList<>(); // Add roles field

    private static final String AUTHORITY_PREFIX = "ROLE_";

    public AppUser(int userId, String firstName, String lastName, String username, String password, boolean disabled, List<String> roles) {
        super(username, password, !disabled, true, true, true, convertRolesToAuthorities(roles));
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.disabled = disabled;
        this.roles = roles;
    }

    // Convert roles to Spring Security GrantedAuthority
    public static List<GrantedAuthority> convertRolesToAuthorities(List<String> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(AUTHORITY_PREFIX + role))
                .collect(Collectors.toList());
    }

    // Convert authorities to roles
    public static List<String> convertAuthoritiesToRoles(Collection<GrantedAuthority> authorities) {
        return authorities.stream()
                .map(authority -> authority.getAuthority().substring(AUTHORITY_PREFIX.length()))
                .collect(Collectors.toList());
    }

    // Setters and getters for the roles field
    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    // Other getters and setters

    public int getAppUserId() {
        return userId;
    }

    public void setAppUserId(int userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    public List<Score> getScores() {
        return scores;
    }

    public void setScores(List<Score> scores) {
        this.scores = scores;
    }
}
