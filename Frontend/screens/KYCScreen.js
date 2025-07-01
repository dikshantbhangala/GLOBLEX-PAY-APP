import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../services/api';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const KYCScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState('not_started'); // not_started, pending, approved, rejected
  const [idProof, setIdProof] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadKYCStatus();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions to upload documents.');
    }
  };

  const loadKYCStatus = async () => {
    setLoading(true);
    try {
      const status = await api.getKYCStatus();
      setKycStatus(status.status);
      if (status.documents) {
        setIdProof(status.documents.idProof);
        setAddressProof(status.documents.addressProof);
      }
    } catch (error) {
      console.log('Error loading KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async (type) => {
    Alert.alert(
      'Select Document',
      'Choose how you want to upload your document',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(type),
        },
        {
          text: 'Photo Library',
          onPress: () => openImagePicker(type),
        },
        {
          text: 'Document',
          onPress: () => openDocumentPicker(type),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async (type) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const document = {
        uri: result.assets[0].uri,
        name: `${type}_${Date.now()}.jpg`,
        type: 'image/jpeg',
      };

      if (type === 'id') {
        setIdProof(document);
      } else {
        setAddressProof(document);
      }
    }
  };

  const openImagePicker = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const document = {
        uri: result.assets[0].uri,
        name: `${type}_${Date.now()}.jpg`,
        type: 'image/jpeg',
      };

      if (type === 'id') {
        setIdProof(document);
      } else {
        setAddressProof(document);
      }
    }
  };

  const openDocumentPicker = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const document = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
        };

        if (type === 'id') {
          setIdProof(document);
        } else {
          setAddressProof(document);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeDocument = (type) => {
    if (type === 'id') {
      setIdProof(null);
    } else {
      setAddressProof(null);
    }
  };

  const submitKYC = async () => {
    if (!idProof || !addressProof) {
      Alert.alert('Error', 'Please upload both ID proof and address proof');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitKYC({
        idProof,
        addressProof,
      });

      setKycStatus('pending');
      Alert.alert(
        'Success',
        'Your KYC documents have been submitted successfully. We will review them within 24-48 hours.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit KYC documents. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (kycStatus) {
      case 'approved':
        return <Ionicons name="checkmark-circle" size={48} color={colors.success} />;
      case 'rejected':
        return <Ionicons name="close-circle" size={48} color={colors.error} />;
      case 'pending':
        return <Ionicons name="time" size={48} color={colors.warning} />;
      default:
        return <Ionicons name="document-text" size={48} color={colors.gold} />;
    }
  };

  const getStatusText = () => {
    switch (kycStatus) {
      case 'approved':
        return 'Your KYC verification is complete';
      case 'rejected':
        return 'Your KYC was rejected. Please contact support.';
      case 'pending':
        return 'Your KYC is under review';
      default:
        return 'Complete your KYC verification';
    }
  };

  const getStatusColor = () => {
    switch (kycStatus) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.white;
    }
  };

  const DocumentCard = ({ title, document, type, onPress, onRemove }) => (
    <View style={styles.documentCard}>
      <Text style={styles.documentTitle}>{title}</Text>
      {document ? (
        <View style={styles.documentPreview}>
          {document.type?.startsWith('image/') ? (
            <Image source={{ uri: document.uri }} style={styles.documentImage} />
          ) : (
            <View style={styles.documentPlaceholder}>
              <Ionicons name="document" size={40} color={colors.gold} />
            </View>
          )}
          <Text style={styles.documentName} numberOfLines={1}>
            {document.name}
          </Text>
          <View style={styles.documentActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.changeButton]}
              onPress={onPress}
            >
              <Text style={styles.actionButtonText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={onRemove}
            >
              <Text style={styles.actionButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
          <Ionicons name="cloud-upload" size={32} color={colors.gold} />
          <Text style={styles.uploadText}>Tap to upload</Text>
          <Text style={styles.uploadHint}>Supported: JPG, PNG, PDF</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Loading KYC status...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KYC Verification</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          {getStatusIcon()}
        </View>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        {kycStatus === 'pending' && (
          <Text style={styles.statusSubtext}>
            We typically review documents within 24-48 hours
          </Text>
        )}
        {kycStatus === 'rejected' && (
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        )}
      </View>

      {(kycStatus === 'not_started' || kycStatus === 'rejected') && (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Required Documents</Text>
            <View style={styles.infoItem}>
              <Ionicons name="card" size={20} color={colors.gold} />
              <Text style={styles.infoText}>
                Government-issued ID (Passport, Driver's License, National ID)
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="home" size={20} color={colors.gold} />
              <Text style={styles.infoText}>
                Proof of Address (Utility Bill, Bank Statement, Lease Agreement)
              </Text>
            </View>
          </View>

          <DocumentCard
            title="ID Proof"
            document={idProof}
            type="id"
            onPress={() => pickDocument('id')}
            onRemove={() => removeDocument('id')}
          />

          <DocumentCard
            title="Address Proof"
            document={addressProof}
            type="address"
            onPress={() => pickDocument('address')}
            onRemove={() => removeDocument('address')}
          />

          <View style={styles.submitSection}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!idProof || !addressProof || submitting) && styles.submitButtonDisabled,
              ]}
              onPress={submitKYC}
              disabled={!idProof || !addressProof || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.black} />
              ) : (
                <Text style={styles.submitButtonText}>Submit for Verification</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    marginTop: 16,
  },
  statusCard: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  contactButton: {
    marginTop: 16,
    backgroundColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    color: colors.gray,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  documentCard: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  uploadText: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadHint: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 4,
  },
  documentPreview: {
    alignItems: 'center',
  },
  documentImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentPlaceholder: {
    width: 120,
    height: 80,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentName: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 12,
    maxWidth: 200,
    textAlign: 'center',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeButton: {
    backgroundColor: colors.gold,
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 12,
  },
  submitSection: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
};

export default KYCScreen;