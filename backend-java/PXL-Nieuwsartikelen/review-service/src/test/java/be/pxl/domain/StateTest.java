package be.pxl.domain;

import be.pxl.services.domain.State;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class StateTest {

    @Test
    void testEnumValues() {
        // Assert the enum constants are correct
        assertEquals(State.CONCEPT, State.valueOf("CONCEPT"));
        assertEquals(State.SUBMITTED, State.valueOf("SUBMITTED"));
        assertEquals(State.REJECTED, State.valueOf("REJECTED"));
        assertEquals(State.APPROVED, State.valueOf("APPROVED"));
        assertEquals(State.PUBLISHED, State.valueOf("PUBLISHED"));
    }

    @Test
    void testEnumCount() {
        // Assert the number of constants in the enum
        assertEquals(5, State.values().length);
    }

    @Test
    void testOrdinalValues() {
        // Assert the ordinal values are correct (this assumes the order is important)
        assertEquals(0, State.CONCEPT.ordinal());
        assertEquals(1, State.SUBMITTED.ordinal());
        assertEquals(2, State.REJECTED.ordinal());
        assertEquals(3, State.APPROVED.ordinal());
        assertEquals(4, State.PUBLISHED.ordinal());
    }

    @Test
    void testEnumToString() {
        // This checks if the enum's name method returns the right string
        assertEquals("CONCEPT", State.CONCEPT.name());
        assertEquals("SUBMITTED", State.SUBMITTED.name());
        assertEquals("REJECTED", State.REJECTED.name());
        assertEquals("APPROVED", State.APPROVED.name());
        assertEquals("PUBLISHED", State.PUBLISHED.name());
    }
}
