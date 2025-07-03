# Integración con Backend - Sistema de Autenticación

## 📋 Configuración Requerida

### 1. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
VUE_APP_API_URL=http://localhost:8080/api
VUE_APP_ENVIRONMENT=development
```

### 2. Endpoints Requeridos en el Backend

#### 🔐 Autenticación
- **POST** `/api/auth/login`
  - **Request Body**: 
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response Success (200)**:
    ```json
    {
      "username": "string",
      "token": "jwt_token_here",
      "roles": ["string"],
      "id": "number"
    }
    ```
  - **Response Error (401)**:
    ```json
    {
      "message": "Usuario o contraseña incorrectos"
    }
    ```

- **POST** `/api/auth/logout` (Opcional)
  - **Headers**: `Authorization: Bearer {token}`
  - **Response**: `200 OK`

#### 👤 Usuario
- **GET** `/api/usuario/me` ✅ (Ya implementado)
  - **Headers**: `Authorization: Bearer {token}`
  - **Response**:
    ```json
    {
      "username": "string",
      "id": "number",
      "roles": ["string"]
    }
    ```

## 🔧 Configuración del Backend Spring Boot

### 1. Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 2. Controlador de Autenticación
```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // URL de tu frontend
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenUtil.generateToken(userDetails);

            return ResponseEntity.ok(new LoginResponse(
                userDetails.getUsername(),
                token,
                userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList())
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Usuario o contraseña incorrectos"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Invalidar token si usas blacklist
        return ResponseEntity.ok().build();
    }
}
```

### 3. DTOs Requeridos
```java
// LoginRequest.java
public class LoginRequest {
    private String username;
    private String password;
    // getters y setters
}

// LoginResponse.java
public class LoginResponse {
    private String username;
    private String token;
    private List<String> roles;
    // constructor, getters y setters
}

// ErrorResponse.java
public class ErrorResponse {
    private String message;
    // constructor, getters y setters
}
```

## 🌐 CORS Configuration
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 🧪 Testing

### 1. Test con cURL
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Obtener usuario actual
curl -X GET http://localhost:8080/api/usuario/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Test desde el Frontend
1. Asegúrate de que el backend esté corriendo en `http://localhost:8080`
2. Inicia el frontend con `npm run dev`
3. Ve a `http://localhost:5173/login`
4. Prueba con las credenciales configuradas en tu backend

## 🚨 Errores Comunes

### CORS Error
- Verifica que el backend tenga configurado CORS para `http://localhost:5173`
- Revisa que los headers `Access-Control-Allow-Origin` estén presentes

### 401 Unauthorized
- Verifica que el endpoint `/api/auth/login` esté disponible sin autenticación
- Revisa que las credenciales sean correctas

### Token Issues
- Verifica que el JWT esté siendo generado correctamente
- Revisa que el header `Authorization: Bearer {token}` esté siendo enviado

## 🔄 Flujo de Autenticación

1. **Usuario ingresa credenciales** → Frontend envía POST a `/api/auth/login`
2. **Backend valida credenciales** → Retorna JWT token
3. **Frontend almacena token** → localStorage/sessionStorage
4. **Futuras peticiones** → Incluyen `Authorization: Bearer {token}`
5. **Token expirado** → Backend retorna 401 → Frontend redirige a login

## 📝 Notas Importantes

- El token se almacena automáticamente en localStorage o sessionStorage
- Todas las peticiones futuras incluirán automáticamente el token
- Si el token expira, el usuario será redirigido automáticamente al login
- La URL de la API se configura en las variables de entorno
