package learn.quizgen.controllers;

import learn.quizgen.domain.Result;
import learn.quizgen.domain.TeacherService;
import learn.quizgen.models.AppUser;
import learn.quizgen.models.Teacher;
import learn.quizgen.security.AppUserService;
import learn.quizgen.security.JwtConverter;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.ValidationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtConverter converter;
    private final AppUserService appUserService;
    private final TeacherService teacherService; // 🔹 NEW

    public AuthController(AuthenticationManager authenticationManager,
                          JwtConverter converter,
                          AppUserService appUserService,
                          TeacherService teacherService) {
        this.authenticationManager = authenticationManager;
        this.converter = converter;
        this.appUserService = appUserService;
        this.teacherService = teacherService; // 🔹 NEW
    }




    @GetMapping("/{username}")
    public UserDetails getUserByUsername(@PathVariable String username){
        return appUserService.loadUserByUsername(username);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> authenticate(@RequestBody Map<String, String> credentials) {

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(credentials.get("username"), credentials.get("password"));

        try {
            Authentication authentication = authenticationManager.authenticate(authToken);

            if (authentication.isAuthenticated()) {
                String jwtToken = converter.getTokenFromUser((User) authentication.getPrincipal());

                HashMap<String, String> map = new HashMap<>();
                map.put("jwt_token", jwtToken);

                return new ResponseEntity<>(map, HttpStatus.OK);
            }

        } catch (AuthenticationException ex) {
            System.out.println(ex.getMessage());
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PostMapping("/register")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, Object> userDetails) {
        AppUser appUser = null;

        try {
            String firstName = (String) userDetails.get("firstName");
            String lastName = (String) userDetails.get("lastName");
            String username = (String) userDetails.get("username");
            String password = (String) userDetails.get("password");
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) userDetails.get("roles");

            appUser = appUserService.create(firstName, lastName, username, password, roles);

            // ⭐ If this user is a Teacher, insert a row into teacher table
            if (roles != null && roles.contains("Teacher")) {
                Teacher teacher = new Teacher(0, appUser.getAppUserId());
                teacherService.add(teacher);
            }

        } catch (ValidationException ex) {
            return new ResponseEntity<>(List.of(ex.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (DuplicateKeyException ex) {
            return new ResponseEntity<>(List.of("The provided username already exists"), HttpStatus.BAD_REQUEST);
        }

        HashMap<String, Integer> map = new HashMap<>();
        map.put("appUserId", appUser.getAppUserId());

        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }
}
