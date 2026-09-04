package controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ImageControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new ImageController()).build();
    }

    @Test
    public void testRedirectToImgurWithUniqueId() throws Exception {
        mockMvc.perform(get("/images/custom/bX7q9K2"))
                .andExpect(status().is3xxRedirection())
                .andExpect(header().string("Location", "https://i.imgur.com/bX7q9K2.jpg"));
    }

    @Test
    public void testRedirectToImgurWithExtension() throws Exception {
        mockMvc.perform(get("/images/custom/bX7q9K2.png"))
                .andExpect(status().is3xxRedirection())
                .andExpect(header().string("Location", "https://i.imgur.com/bX7q9K2.png"));
    }
}
