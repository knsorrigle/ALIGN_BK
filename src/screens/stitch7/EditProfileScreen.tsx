import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Modal,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import * as ImagePicker from 'expo-image-picker';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const W = Dimensions.get('window').width;
const PHOTO_SLOT = (W - 48 - 16) / 3; // 24px padding each side, 2 gaps of 8px

// ── Prompt questions (same as onboarding) ────────────────────────────────────
const PROMPT_QUESTIONS = [
    "A non-negotiable for me is...",
    "I'm convinced that...",
    "The way to win me over is...",
    "My simple pleasure is...",
    "I geek out on...",
    "Together we could...",
    "I'm looking for...",
    "My most controversial opinion is...",
    "I bet you can't...",
    "Worst idea I've ever had...",
];

// ── Pill options ─────────────────────────────────────────────────────────────
const GENDER_OPTS = ['Man', 'Woman', 'Non-binary', 'Other'];
const PRONOUN_OPTS = ['he/him', 'she/her', 'they/them', 'xe/xem', 'ey/em'];
const SEXUALITY_OPTS = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Queer', 'Asexual', 'Other'];
const RELATION_OPTS = ['Monogamy', 'Ethical non-monogamy', 'Open to both'];
const INTENTION_OPTS = ['Long-term', 'Short-term', 'Casual', 'Friends first', 'Not sure'];
const CHILDREN_OPTS = ['Want children', "Don't want", 'Have children', 'Open to it', 'Not sure'];
const DRINKING_OPTS = ['Never', 'Rarely', 'Socially', 'Often'];
const TOBACCO_OPTS = ['Never', 'Occasionally', 'Regularly'];
const DRUGS_OPTS = ['Never', 'Occasionally', 'Often'];
const POLITICS_OPTS = ['Liberal', 'Conservative', 'Moderate', 'Apolitical', 'Other'];
const RELIGION_OPTS = ['Agnostic', 'Atheist', 'Buddhist', 'Catholic', 'Christian', 'Hindu', 'Jewish', 'Muslim', 'Spiritual', 'Other'];
const EDUCATION_OPTS = ['High school', 'Some college', "Bachelor's", "Master's", 'PhD', 'Trade school', 'Other'];
const DISTANCE_OPTS = ['Local', 'Regional', 'National', 'Open'];

// ── Reusable UI ──────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
    return <Text style={styles.sectionLabel}>{text}</Text>;
}

function FieldLabel({ text }: { text: string }) {
    return <Text style={styles.fieldLabel}>{text}</Text>;
}

function FieldInput({ value, onChangeText, placeholder, multiline = false }: {
    value: string; onChangeText: (t: string) => void; placeholder: string; multiline?: boolean;
}) {
    return (
        <TextInput
            style={[styles.fieldInput, multiline && { height: 88, textAlignVertical: 'top' }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(13,13,13,0.3)"
            multiline={multiline}
        />
    );
}

function PillSelector({ options, value, onChange }: {
    options: string[]; value: string | null | undefined; onChange: (v: string) => void;
}) {
    return (
        <View style={styles.pillRow}>
            {options.map((opt) => {
                const selected = (value ?? '').toLowerCase() === opt.toLowerCase();
                return (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => onChange(selected ? '' : opt)}
                        activeOpacity={0.8}
                        style={[styles.pill, selected && styles.pillActive]}
                    >
                        <Text style={[styles.pillText, selected && styles.pillTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function MultiPillSelector({ options, values, onChange }: {
    options: string[]; values: string[]; onChange: (v: string[]) => void;
}) {
    return (
        <View style={styles.pillRow}>
            {options.map((opt) => {
                const selected = values.some((v) => v.toLowerCase() === opt.toLowerCase());
                return (
                    <TouchableOpacity
                        key={opt}
                        onPress={() =>
                            onChange(
                                selected
                                    ? values.filter((v) => v.toLowerCase() !== opt.toLowerCase())
                                    : [...values, opt]
                            )
                        }
                        activeOpacity={0.8}
                        style={[styles.pill, selected && styles.pillActive]}
                    >
                        <Text style={[styles.pillText, selected && styles.pillTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { user } = useUser();

    const currentUser = useQuery(api.users.getCurrentUser);
    const photos = useQuery(api.files.getUserPhotos);
    const updateUser = useMutation(api.users.updateUser);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveProfilePhoto = useMutation(api.files.saveProfilePhoto);
    const deletePhotoMutation = useMutation(api.files.deletePhoto);

    // State
    const [firstName, setFirstName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [pronouns, setPronouns] = useState<string[]>([]);
    const [sexuality, setSexuality] = useState('');
    const [bio, setBio] = useState('');
    const [hometown, setHometown] = useState('');
    const [location, setLocation] = useState('');
    const [relationshipType, setRelationshipType] = useState('');
    const [datingIntention, setDatingIntention] = useState('');
    const [children, setChildren] = useState('');
    const [drinking, setDrinking] = useState('');
    const [tobacco, setTobacco] = useState('');
    const [drugs, setDrugs] = useState('');
    const [politics, setPolitics] = useState('');
    const [religion, setReligion] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [education, setEducation] = useState('');
    const [school, setSchool] = useState('');
    const [distancePreference, setDistancePreference] = useState('');
    const [prompts, setPrompts] = useState([
        { id: 1, question: '', answer: '' },
        { id: 2, question: '', answer: '' },
        { id: 3, question: '', answer: '' },
    ]);
    const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
    const [pickerPromptIdx, setPickerPromptIdx] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const initialized = useRef(false);
    useEffect(() => {
        if (currentUser && !initialized.current) {
            initialized.current = true;
            setFirstName(currentUser.firstName || (currentUser as any).name || '');
            setBirthday((currentUser as any).birthday || '');
            setGender((currentUser as any).gender || '');
            setPronouns((currentUser as any).pronouns || []);
            setSexuality((currentUser as any).sexuality || '');
            setBio((currentUser as any).publicBio || '');
            setHometown((currentUser as any).hometown || '');
            setLocation((currentUser as any).location || '');
            setRelationshipType((currentUser as any).relationshipType || '');
            setDatingIntention((currentUser as any).datingIntention || '');
            setChildren((currentUser as any).children || '');
            setDrinking((currentUser as any).drinking || '');
            setTobacco((currentUser as any).tobacco || '');
            setDrugs((currentUser as any).drugs || '');
            setPolitics((currentUser as any).politics || '');
            setReligion((currentUser as any).religion || '');
            setWorkplace((currentUser as any).workplace || '');
            setEducation((currentUser as any).education || '');
            setSchool((currentUser as any).school || '');
            setDistancePreference((currentUser as any).distancePreference || '');

            const existing: { question: string; answer: string }[] = (currentUser as any).prompts || [];
            const mapped = existing.slice(0, 3).map((p, i) => ({
                id: i + 1,
                question: p.question || '',
                answer: p.answer || '',
            }));
            while (mapped.length < 3) mapped.push({ id: mapped.length + 1, question: '', answer: '' });
            setPrompts(mapped);
        }
    }, [currentUser]);

    // Photo upload
    const handlePickPhoto = async (position: number) => {
        if (uploadingSlot !== null) return;
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (result.canceled || !result.assets?.[0]?.uri) return;
        const uri = result.assets[0].uri;
        setUploadingSlot(position);
        try {
            const uploadUrl = await generateUploadUrl();
            // Step 1: Read local file URI as a native Blob via XHR
            const blob: Blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => reject(new Error('Failed to read image file'));
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });
            // Step 2: PUT the blob to Convex storage
            const uploadRes = await fetch(uploadUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'image/jpeg' },
                body: blob,
            });
            if (!uploadRes.ok) {
                const errText = await uploadRes.text();
                throw new Error(`Upload failed (${uploadRes.status}): ${errText}`);
            }
            const { storageId } = await uploadRes.json();
            await saveProfilePhoto({ storageId, position });
        } catch (err: any) {
            Alert.alert('Upload Failed', err?.message || 'Could not upload photo. Please try again.');
        } finally {
            setUploadingSlot(null);
        }
    };

    const handleDeletePhoto = async (photoId: any) => {
        try {
            await deletePhotoMutation({ photoId });
        } catch { /* ignore */ }
    };

    const handleSave = async () => {
        if (!user || saving) return;
        setSaving(true);
        try {
            await updateUser({
                clerkId: user.id,
                firstName: firstName || null,
                birthday: birthday || null,
                gender: gender || null,
                pronouns: pronouns.length > 0 ? pronouns : null,
                sexuality: sexuality || null,
                publicBio: bio || null,
                hometown: hometown || null,
                location: location || null,
                relationshipType: relationshipType || null,
                datingIntention: datingIntention || null,
                children: children || null,
                drinking: drinking || null,
                tobacco: tobacco || null,
                drugs: drugs || null,
                politics: politics || null,
                religion: religion || null,
                workplace: workplace || null,
                education: education || null,
                school: school || null,
                distancePreference: distancePreference || null,
                prompts: prompts
                    .filter((p) => p.question && p.answer)
                    .map((p) => ({ question: p.question, answer: p.answer })),
            });
            navigation.goBack();
        } catch {
            Alert.alert('Error', 'Could not save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Build 6 photo slots from fetched photos
    const photoSlots: ({ _id: any; url: string } | null)[] = Array(6).fill(null);
    (photos ?? []).forEach((p: any) => {
        if (p.position >= 0 && p.position < 6) photoSlots[p.position] = { _id: p._id, url: p.url };
    });

    return (
        <View style={[styles.root, { backgroundColor: CREAM }]}>
            <StatusBar style="dark" />

            {/* Sticky header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color={BLACK} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>{saving ? 'SAVING...' : 'SAVE'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.headline}>EDIT{'\n'}PROFILE.</Text>

                {/* ── PHOTOS ───────────────────────────────────────────── */}
                <SectionLabel text="PHOTOS" />
                <View style={styles.photoGrid}>
                    {photoSlots.map((slot, idx) => (
                        <View key={idx} style={styles.photoSlot}>
                            {slot ? (
                                <TouchableOpacity onPress={() => handlePickPhoto(idx)} activeOpacity={0.85}>
                                    <Image source={{ uri: slot.url }} style={styles.photoImg} />
                                    <TouchableOpacity
                                        onPress={() => handleDeletePhoto(slot._id)}
                                        style={styles.deleteBtn}
                                        activeOpacity={0.8}
                                        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                                    >
                                        <Ionicons name="close" size={12} color={CREAM} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ) : uploadingSlot === idx ? (
                                <View style={styles.photoEmpty}>
                                    <ActivityIndicator size="small" color={ORANGE} />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={() => handlePickPhoto(idx)} style={styles.photoEmpty} activeOpacity={0.7}>
                                    <Ionicons name="add" size={24} color="rgba(13,13,13,0.3)" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                {/* ── BASIC INFO ───────────────────────────────────────── */}
                <SectionLabel text="BASIC INFO" />
                <View style={styles.card}>
                    <FieldLabel text="FIRST NAME" />
                    <FieldInput value={firstName} onChangeText={setFirstName} placeholder="First name" />

                    <FieldLabel text="BIRTHDAY" />
                    <FieldInput value={birthday} onChangeText={setBirthday} placeholder="YYYY-MM-DD" />

                    <FieldLabel text="GENDER" />
                    <PillSelector options={GENDER_OPTS} value={gender} onChange={setGender} />

                    <FieldLabel text="PRONOUNS" />
                    <MultiPillSelector options={PRONOUN_OPTS} values={pronouns} onChange={setPronouns} />

                    <FieldLabel text="SEXUALITY" />
                    <PillSelector options={SEXUALITY_OPTS} value={sexuality} onChange={setSexuality} />
                </View>

                {/* ── ABOUT YOU ────────────────────────────────────────── */}
                <SectionLabel text="ABOUT YOU" />
                <View style={styles.card}>
                    <FieldLabel text="BIO" />
                    <FieldInput value={bio} onChangeText={setBio} placeholder="Write something about yourself..." multiline />

                    <FieldLabel text="HOMETOWN" />
                    <FieldInput value={hometown} onChangeText={setHometown} placeholder="Where you grew up" />

                    <FieldLabel text="LOCATION" />
                    <FieldInput value={location} onChangeText={setLocation} placeholder="Where you live now" />
                </View>

                {/* ── PROMPTS ──────────────────────────────────────────── */}
                <SectionLabel text="PROMPTS" />
                <View style={styles.card}>
                    {prompts.map((prompt, idx) => (
                        <View key={prompt.id} style={idx > 0 ? styles.promptDivider : undefined}>
                            <TouchableOpacity
                                onPress={() => setPickerPromptIdx(idx)}
                                activeOpacity={0.8}
                                style={styles.promptQRow}
                            >
                                <Text
                                    style={[styles.promptQText, !prompt.question && { color: 'rgba(13,13,13,0.3)' }]}
                                    numberOfLines={2}
                                >
                                    {prompt.question || 'TAP TO SELECT A PROMPT'}
                                </Text>
                                <Ionicons name="chevron-down" size={14} color={ORANGE} />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.promptAnswer}
                                value={prompt.answer}
                                onChangeText={(t) => {
                                    const next = [...prompts];
                                    next[idx] = { ...next[idx], answer: t };
                                    setPrompts(next);
                                }}
                                placeholder={prompt.question ? 'Your answer...' : ''}
                                placeholderTextColor="rgba(13,13,13,0.3)"
                                multiline
                                editable={!!prompt.question}
                            />
                        </View>
                    ))}
                </View>

                {/* ── RELATIONSHIP ─────────────────────────────────────── */}
                <SectionLabel text="RELATIONSHIP" />
                <View style={styles.card}>
                    <FieldLabel text="RELATIONSHIP TYPE" />
                    <PillSelector options={RELATION_OPTS} value={relationshipType} onChange={setRelationshipType} />

                    <FieldLabel text="DATING INTENTION" />
                    <PillSelector options={INTENTION_OPTS} value={datingIntention} onChange={setDatingIntention} />

                    <FieldLabel text="CHILDREN" />
                    <PillSelector options={CHILDREN_OPTS} value={children} onChange={setChildren} />
                </View>

                {/* ── LIFESTYLE ────────────────────────────────────────── */}
                <SectionLabel text="LIFESTYLE" />
                <View style={styles.card}>
                    <FieldLabel text="DRINKING" />
                    <PillSelector options={DRINKING_OPTS} value={drinking} onChange={setDrinking} />

                    <FieldLabel text="SMOKING / TOBACCO" />
                    <PillSelector options={TOBACCO_OPTS} value={tobacco} onChange={setTobacco} />

                    <FieldLabel text="DRUGS" />
                    <PillSelector options={DRUGS_OPTS} value={drugs} onChange={setDrugs} />

                    <FieldLabel text="POLITICS" />
                    <PillSelector options={POLITICS_OPTS} value={politics} onChange={setPolitics} />

                    <FieldLabel text="RELIGION" />
                    <PillSelector options={RELIGION_OPTS} value={religion} onChange={setReligion} />
                </View>

                {/* ── CAREER & EDUCATION ───────────────────────────────── */}
                <SectionLabel text="CAREER & EDUCATION" />
                <View style={styles.card}>
                    <FieldLabel text="WORKPLACE" />
                    <FieldInput value={workplace} onChangeText={setWorkplace} placeholder="Where you work" />

                    <FieldLabel text="EDUCATION" />
                    <PillSelector options={EDUCATION_OPTS} value={education} onChange={setEducation} />

                    <FieldLabel text="SCHOOL" />
                    <FieldInput value={school} onChangeText={setSchool} placeholder="School or university" />
                </View>

                {/* ── PREFERENCES ──────────────────────────────────────── */}
                <SectionLabel text="PREFERENCES" />
                <View style={styles.card}>
                    <FieldLabel text="DISTANCE" />
                    <PillSelector options={DISTANCE_OPTS} value={distancePreference} onChange={setDistancePreference} />
                </View>
            </ScrollView>

            {/* Prompt question picker modal */}
            <Modal
                visible={pickerPromptIdx !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setPickerPromptIdx(null)}
            >
                <TouchableOpacity
                    style={styles.modalBg}
                    activeOpacity={1}
                    onPress={() => setPickerPromptIdx(null)}
                />
                <View style={[styles.pickerSheet, { paddingBottom: insets.bottom + 20 }]}>
                    <Text style={styles.pickerTitle}>CHOOSE A PROMPT</Text>
                    {PROMPT_QUESTIONS.map((q) => (
                        <TouchableOpacity
                            key={q}
                            onPress={() => {
                                if (pickerPromptIdx !== null) {
                                    const next = [...prompts];
                                    next[pickerPromptIdx] = { ...next[pickerPromptIdx], question: q };
                                    setPrompts(next);
                                    setPickerPromptIdx(null);
                                }
                            }}
                            style={styles.pickerItem}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.pickerItemText}>{q}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 12,
        backgroundColor: CREAM,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(13,13,13,0.06)',
    },
    iconBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveBtn: {
        backgroundColor: BLACK,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 100,
    },
    saveBtnText: {
        fontSize: 11,
        fontWeight: '900',
        color: CREAM,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 60,
    },
    headline: {
        fontSize: Math.round(W * 0.15),
        fontWeight: '900',
        color: BLACK,
        letterSpacing: -3,
        lineHeight: Math.round(W * 0.145),
        textTransform: 'uppercase',
        marginBottom: 28,
        marginTop: 8,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: ORANGE,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
        marginTop: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
        gap: 10,
    },
    fieldLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 6,
    },
    fieldInput: {
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.15)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: '500',
        color: BLACK,
        backgroundColor: 'rgba(13,13,13,0.02)',
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.15)',
        backgroundColor: '#FFFFFF',
    },
    pillActive: {
        backgroundColor: BLACK,
        borderColor: BLACK,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
        color: BLACK,
    },
    pillTextActive: {
        color: CREAM,
    },
    // Photos
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    photoSlot: {
        width: PHOTO_SLOT,
        height: PHOTO_SLOT,
    },
    photoImg: {
        width: PHOTO_SLOT,
        height: PHOTO_SLOT,
        borderRadius: 12,
    },
    photoEmpty: {
        width: PHOTO_SLOT,
        height: PHOTO_SLOT,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(13,13,13,0.15)',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(13,13,13,0.02)',
    },
    deleteBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: BLACK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Prompts
    promptDivider: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(13,13,13,0.06)',
        marginTop: 8,
        paddingTop: 12,
    },
    promptQRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    promptQText: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        flex: 1,
        marginRight: 8,
    },
    promptAnswer: {
        fontSize: 15,
        fontWeight: '500',
        color: BLACK,
        lineHeight: 22,
        minHeight: 36,
    },
    // Modal
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(13,13,13,0.5)',
    },
    pickerSheet: {
        backgroundColor: CREAM,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 28,
        paddingHorizontal: 24,
    },
    pickerTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: ORANGE,
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 16,
    },
    pickerItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(13,13,13,0.06)',
    },
    pickerItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: BLACK,
        lineHeight: 22,
    },
});
